##########ビルド系
init:  #新規のビルド
	docker compose -f docker-compose.yml up -d --build

init-local:
	docker compose -f docker-compose.local.yml up -d --build

build:  #キャッシュを使わないビルド,起動はしない
	docker-compose -f docker-compose.yml build --no-cache

build-local:
	docker-compose -f docker-compose.local.yml build --no-cache

up:  #セットアップや既存イメージの再ビルド
	docker compose -f docker-compose.yml up -d

up-local:
	docker compose -f docker-compose.local.yml up -d

down:  #コンテナ削除
	docker compose down --remove-orphans

start:  #コンテナの起動
	docker compose -f docker-compose.yml start

start-local:
	docker compose -f docker-compose.local.yml start

stop:  #コンテナの停止
	docker compose stop

##########コンテナ操作系

restart: #コンテナの再起動
	@make stop
	@make up

restart-local: #コンテナの再起動
	@make stop
	@make up-local

remake:  #コンテナの再生成
	@make down
	@make up

remake-local:  #コンテナの再生成
	@make down
	@make up-local

reupdate:  #コンテナを更新
	@make down
	@make init

reupdate-local:  #コンテナを更新
	@make down
	@make init-local

reset:  #全てのデータを削除し、新規ビルド(成果物は消えない)
	@make destroy
	@make init

reset-local:  #全てのデータを削除し、新規ビルド(成果物は消えない)
	@make destroy
	@make init-local

destroy: #イメージ、ボリューム、その他コンテナを全て削除します
	docker compose down --rmi all --volumes --remove-orphans

destroy-volumes: #ボリュームの削除
	docker compose down --volumes --remove-orphans

##########コンテナに入る系

app:  #appコンテナ(next.jsのコンテナ)に入る
	docker compose exec app sh

app-bash:  #appコンテナ(next.jsのコンテナ)に入る(bash)
	docker compose exec app bash

ps: . #現在稼働中のコンテナを表示
	docker compose ps

##########その他

npm-dev:  #サーバーを起動(コンテナ起動時にport:3000は使われているため、あまり意味はない)
	docker-compose exec app npm run dev

##########ブラウザ表示系

mac-app:  #MacOSの場合はこれでブラウザが開く
	open http://localhost:3000
mac-prisma:
	docker-compose exec app npx prisma studio

linux-app:  #LinuxOSの場合はこれでブラウザが開く
	xdg-open http://localhost:3000
linux-prisma:
	docker-compose exec app npx prisma studio

win-app:  #WindowsOSの場合はこれでブラウザが開く
	start http://localhost:3000
win-prisma:
	docker-compose exec app npx prisma studio