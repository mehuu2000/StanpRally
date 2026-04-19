# 文化フェスティバル　スタンプラリー

## 目次

- 概要
- 初回セットアップ
- ライブラリの追加
- 新しい要素を追加する(コードを書く)場合
- 環境について

----

### 概要

関西大学文化会本部の広報部長の方からVersearへ制作の依頼を受けたので作成しています。
このスタンプラリーサイトは、文化フェスティバルの参加促進キャンペーンの一環です。
文化フェスティバルとは文化会に所属する団体が日々の成果を発表するイベントとなります。

----

### 初回セットアップ

**.envがないので、各自で設定することになります。**

.env作成は.env.exampleを参考にしてください

```sh
git clone git@github.com:fuji-byte/StampRally.git

cd StampRally

npm ci # エラーがでたら npm audit fix
npx prisma generate
```

ローカル環境で実行する場合（おすすめ）

```sh
npm run dev # ローカル環境はここでセットアップ・実行完了
```

docker環境で実行する場合

```sh
make init
```

```sh
make [mack, win, linux]-app  # 各自のOSで[]内を変えてください
```

これでブラウザが開かれるので確認してください
>開かない場合は```http://localhost:3000```で開いてください

```sh
make app
```

でコンテナに入ってから

```sh
npm install ???
```

としてください
>(コンテナがライブラリを認識しないことがあるので)

----

### GitHubのすすめ

#### GitHub上の最新の情報を持ってくる(作業を始める時に実行する)

編集しているものがある場合

```sh
git add .
git commit -m "コミットメッセージ"
```

GitHub上の最新の情報を反映

```sh
git pull # GitHubから現在のブランチの最新の情報を引っ張ってくる(ローカルに影響はない)
git merge origin/feature/〇〇 # リモートブランチ origin/feature/〇〇 の変更履歴を、現在のブランチに統合（マージ）する
```

イメージ
リモート feature/oo
     ↓　--- 上はリモート、下はローカル
origin/feature/oo ← ★git pullで更新
     ↓
現在のブランチ ← ★git mergeで更新

tips git pullした直後、diffを見るコマンド

```sh
git diff --name-status 自分のブランチ名 origin/取り込むブランチ名  # 差分が簡単に見れる
```

コンフリクトが起きた時
diffを見ながら編集。もしくは、ディスコードなどで相談する。

#### 新しい機能を実装する場合（新しく作業を始めるとき）

①**developブランチになっているか確認**

```sh
git branch -l
   main
*  develop <- *がついているので、いまdevelopブランチ
```

developブランチでない場合

```sh
git switch develop
```

②新しく作業ブランチを作成

```sh
git checkout -b feature/〇〇  # 新しいブランチを作成(どのような機能か〇〇に)
or
git switch -c feature/〇〇
```

#### 新しい機能が実装出来たら

```sh
git add . # ここの.はすべてのファイルという意味
```

```sh
git commit -m "コミットメッセージ（どのような作業をしたか書く）"
```

ここで初めてGitHub上にアップロードする

```sh
git push origin feature/〇〇 # 作業したブランチ名
```

```sh
git checkout develop  # developブランチに移動
or
git switch develop
```

#### 作成したものをmainブランチにマージしたい場合

GitHubを開き、Pull requestsに移動

New pull requestをクリック

base: main <- compare: feature/〇〇 # マージしたいブランチ名

create pull request

他の人にレビューしてもらう

レビューが通ったらMerge pull requestをクリック

マージ完了！

#### もしmainやdevelopで開発しちゃった！といった時は

```sh
git stash  # 変更を一時保存
```

```sh
git checkout -b feature/〇〇  # 変更を置くブランチを作成&移動
```

```sh
git stash pop  # 一時保存の変更を反映
```

で、できます

⚠️ **注意:** mainに直接pushしないでください。developを用意しているのでそれを編集し、push, fetch, margeしてください

----

### 環境について

今回大学のWi-Fiではsupabaseに通信できません。また、supabaseもリソースに制限があるため、ローカルでも動くように環境を二つ作りました。

本番に近い通信

next.js(docker) + supabase

起動方法などは普通のmakeコマンド

開発用の環境

next.js(docker) + postgreSQL(docker)

起動方法などはまず、project/prisma/schema.prismaのurlをLocal_DATABASE_URLに切り替えておく

今まで使ってきたmakeコマンドの一番後ろに```-local```をつけ環境を起動

prisma/migrationsがない場合は

```sh
npx prisma migrate dev --name init
```

ある場合は

```sh
npx prisma migrate deploy
```

とすること
