NODE_VERSION = 18

.PHONY: install build start test migrate run-migrations

run:
	. ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm run start

run-migrations:
	. ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm run migrations

migrate:
	. ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm run migrate

run-studio:
	. ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm run studio

install:
	. ~/.nvm/nvm.sh && nvm use $(NODE_VERSION) && npm install

# build:
# 	@read -p "Enter the build host: " HOST; \
# 	read -p "Enter the build port: " PORT; \
# 	BASEURL="$${HOST}:$${PORT}"; \
# 	jq '.baseUrl = ${BASEURL}' $(CONFIG_LOC) > $(CONFIG_LOC).tmp && mv $(CONFIG_LOC).tmp $(CONFIG_LOC)
