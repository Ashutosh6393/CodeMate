FROM public.ecr.aws/lambda/nodejs:16

# Install compilers and interpreters
RUN yum install -y gcc gcc-c++ python3 java-1.8.0-openjdk

# Install Node.js interpreter
RUN npm install -g ts-node

# Copy function code
COPY /src/app.js ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could be app.handler or another function in app.js)
CMD [ "app.handler" ]
