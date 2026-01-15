import os

from resources.image import ImageModel
from schemas.image import ImageSchema


image_schema = ImageSchema()

def default_image():
    default_image = {'name': "Test", 'value': "jesse970146/base4.5:hashpw", 'Description': "toolmen image test"}
    image = image_schema.load(default_image)
    image.save_to_db()