from app import app, load_model_and_data

# Load the model and data when the WSGI application starts
if __name__ == "__main__":
    load_model_and_data()
else:
    # For production deployment, load model when module is imported
    try:
        load_model_and_data()
    except Exception as e:
        print(f"Error loading model: {e}")
        # Continue without model - health check will show status
