import tensorflow as tf
import numpy as np
from google.cloud import storage
from PIL import Image
from skimage.transform import resize
from io import BytesIO
import base64
from flask import jsonify

# We keep model as global variable so we don't have to reload it in case of warm invocations
model = None


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

    print('Blob {} downloaded to {}.'.format(
        source_blob_name,
        destination_file_name))


def handler(request):
    global model

    # Model load which only happens during cold starts
    if model is None:
        download_blob('soa-bucket', 'digit-mnist/variables.index',
                      '/tmp/variables.index')
        download_blob('soa-bucket', 'digit-mnist/variables.data-00000-of-00001',
                      '/tmp/variables.data-00000-of-00001')
        model = define_model()
        model.load_weights('/tmp/variables')

    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    image = request.get_json()
    predictions = ''
    if image:
        im = Image.open(BytesIO(base64.b64decode(image[22:])))
        img = np.array(im) / 255
        image = resize(img, (28, 28, 1))
        image_np = np.expand_dims(image, 0)
        predictions = model.predict(image_np)
        print(predictions)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    return jsonify(predictions[0].tolist()), 200, headers


def define_model():
    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Conv2D(input_shape=(28, 28, 1), filters=6, kernel_size=[5, 5], activation="relu", strides=(1, 1), padding="same"))
    model.add(tf.keras.layers.MaxPool2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Conv2D(filters=64, kernel_size=[5, 5], activation="relu", strides=(1, 1), padding="same"))
    model.add(tf.keras.layers.MaxPool2D(pool_size=(2, 2)))
    model.add(tf.keras.layers.Flatten())
    model.add(tf.keras.layers.Dense(128, activation="relu"))
    model.add(tf.keras.layers.Dense(10, activation="softmax"))

    model.compile(optimizer="sgd", loss="sparse_categorical_crossentropy", metrics=['accuracy'])

    return model