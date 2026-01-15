from flask import abort, request
from flask_restful import Resource
from functions.decorator import admin_required, active_required
from models.image import ImageModel
from schemas.image import ImageSchema
from functions.strings import gettext

image_schema = ImageSchema()
image_list_schema = ImageSchema(many=True)

# /image/<string:image_name>'
class Image(Resource):
    @admin_required()
    def delete(self, image_name: str):
        image = ImageModel.find_by_name(image_name)
        if not image:
            abort (404, message=gettext("image_not_found"))

        image.delete_from_db()
        return {"message": gettext("image_deleted")}, 200
    
# /image
class ImageList(Resource):
    @active_required()
    def get(self):
        return {'images': image_list_schema.dump(ImageModel.find_all())}
    
    @admin_required()
    def post(self):
        image_json = request.get_json()
        image_data = image_schema.load(image_json)
       
        if ImageModel.find_by_name(image_data.name):
            abort(400, message=f"An image with name '{image_data.name}' already exists.")
            
        try:
            image_data.save_to_db()
        except:
            abort(500, message=f"An error occurred during creating the image.")

        return image_schema.dump(image_data), 201
