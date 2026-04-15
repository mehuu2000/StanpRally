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

任意のブランチで

```sh
git clone https://github.com/mehuu2000/StanpRally.git
```

プロジェクトディレクトリに移動

```sh
npm ci
npx prisma migrate dev
npm run dev
```

.envを設定

```sh
make init
```

```sh
make [mack, win, linux]-app  #各自のOSで[]内を変えてください
```

これでブラウザが開かれるので確認してください
>開かない場合は```http://localhost:3000```で開いてください

----

### ライブラリの追加

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

### 新しい要素を追加する(コードを書く)場合

**developから**

```sh
git checkout -b feature/〇〇  #新しいブランチを作成
or
git switch -c feature/〇〇
```

### 編集が終わると

```sh
git add .
```

```sh
git commit -m "コミットメッセージ（どのような作業をしたか書く）"
```

```sh
git puch origin feature/〇〇
```

```sh
git checkout develop  #developブランチに移動
or
git switch develop
```

```sh
git merge --squash feature/〇〇  #developブランチにfeature/〇〇の変更を追加
```

```sh
git commit -m "⬜︎⬜︎"  #追加した変更にコメントを設定
```

```sh
git push origin develop  #developに適応
```

するのがいいかなと思います。

#### もしmainやdevelopで開発しちゃった！といった時は

```sh
git stash  #変更を一時保存
```

```sh
git checkout -b feature/〇〇  #変更を置くブランチを作成&移動
```

```sh
git stash pop  #一時保存の変更を反映
```

で、できます

⚠️ **注意:** mainに直接pushしないでください。developを用意しているのでそれを編集し、push, fetch, margeしてください

----

#### 変更を取り込むとき

```sh
git add .
```

```sh
git commit "一時保存"  #避難している感じで分かればいい
```

```sh
git push origin feature/〇〇  #変更を加えたブランチを避難
```

```sh
git fetch origin 〇〇  #他の人がpushしたブランチ
```

```sh
git diff --name-status 自分のブランチ名 origin/取り込むブランチ名  #差分が簡単に見れる
```

```sh
git merge origin/取り込むブランチ名  #変更を取り込む
```

コンフリクトが起こるかもなので、起きたら頑張りましょう

----

### 環境について

今回大学のwifiではsupabaseに通信できません。また、supabaseもリソースに制限があるため、ローカルでも動くように環境を二つ作りました。

本番に近い通信

```
next.js(docker) + supabase
```

起動方法などは普通のmakeコマンド

開発用の環境

```
next.js(docker) + postgreSQL(docker)
```

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
