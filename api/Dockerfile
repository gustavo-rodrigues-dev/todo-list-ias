FROM public.ecr.aws/lambda/nodejs:14

# Ensure all users can write to npm cache
RUN mkdir /tmp/npm-cache && \
    chmod -R 777 /tmp/npm-cache && \
    npm config --global set cache /tmp/npm-cache

# Disable npm update notifications
RUN npm config --global set update-notifier false

RUN mkdir -p "${LAMBDA_TASK_ROOT}"/ 
WORKDIR ${LAMBDA_TASK_ROOT}/ 
COPY . ${LAMBDA_TASK_ROOT}/ 

RUN npm ci

RUN npm run build

RUN npm prune --production

RUN rm -rf "${LAMBDA_TASK_ROOT}"/src

# create non root user and change allow execute command for non root user
RUN mv "${LAMBDA_TASK_ROOT}"/dist/** "${LAMBDA_TASK_ROOT}"/

CMD [ "index.handle" ]
