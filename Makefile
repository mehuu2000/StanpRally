init:  #新規のビルド
	docker compose -f docker-compose.yml up -d --build

app:  #appコンテナ(nextのコンテナ)に入る
	docker compose exec app sh

stop:  #コンテナの停止
	docker-compose stop

up:  #セットアップや既存イメージの再ビルド
	docker-compose -f docker-compose.yml up -d

down:  #コンテナ削除
	docker-compose down --remove-orphans

build:  #キャッシュを使わないビルド,起動はしない
	docker-compose -f docker-compose.yml build --no-cache

restart:
	@make stop
	@make up

npm-dev:  #サーバーを起動(コンテナ起動時にport:3000は使われているため、あまり意味はない)
	docker-compose exec app npm run dev

mac-next:  #MacOSの場合はこれでブラウザが開く
	open http://localhost:3000
mac-prisma:
	docker-compose exec app npx prisma studio

linux-next:  #LinuxOSの場合はこれでブラウザが開く
	xdg-open http://localhost:3000
linux-prisma:
	docker-compose exec app npx prisma studio

win-next:  #WindowsOSの場合はこれでブラウザが開く
	start http://localhost:3000
win-prisma:
	docker-compose exec app npx prisma studio