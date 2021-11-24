FROM python:3.8
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=development
ENV FLASK_DEBUG=0
ENV FLASK_RUN_HOST=0.0.0.0
COPY requirements.txt backend/requirements.txt
RUN pip install -r backend/requirements.txt
COPY . /backend/.
CMD ["python", "-u", "-m", "flask", "run"]
