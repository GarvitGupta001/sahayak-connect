# Use an official Python runtime as a parent image
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Copy the local directory contents into the container at /app
COPY . /app

# Install any needed packages
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port that your Flask app will run on. Hugging Face Spaces uses 7860.
EXPOSE 7860

# This is the crucial part. It tells Gunicorn to run your 'app' object
# from the 'getting_schemes.py' file.
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "src.getting_schemes:app"]