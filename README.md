### 目次
- 初めに
- 初回セットアップ
- ライブラリの追加
- 新しい要素を追加する(コードを書く)場合
- 環境について

----

### 初めに

**.envがないので、各自で設定することになります。**

必要そうなコマンドはMakefileに登録しているので、確認しておいてください

**必要なコマンドがなければ各自追加しておいてください**

----

### 初回セットアップ

任意のブランチで

```sh
git clone https://github.com/mehuu2000/StanpRally.git
```

プロジェクトディレクトリに移動

```sh
npm ci
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

---

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
git checkout -b future/〇〇  #新しいブランチを作成
```

#### 編集が終わると

```sh
git add .
```

```sh
git commit -m "⬜︎⬜︎"
```

```sh
git puch origin future/〇〇
```

```sh
git checkout develop  #developブランチに移動
```

```sh
git merge --squash future/〇〇  #developブランチにfuture/〇〇の変更を追加
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
git checkout -b future/〇〇  #変更を置くブランチを作成&移動
```

```sh
git stash pop  #一時保存の変更を反映
```

で、できます

⚠️ **注意:** mainに直接pushしないでください。developを用意しているのでそれを編集し、push, fetch, margeしてください

----

### 変更を取り込むとき

```sh
git add .
```

```sh
git commit "一時保存"  #避難している感じで分かればいい
```

```sh
git push origin future/〇〇  #変更を加えたブランチを避難
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
next.js(docekr) + supabase
```

起動方法などは普通のmakeコマンド

開発用の環境

```
next.js(docekr) + postgreSQL(docker)
```

起動方法などはまず、project/prisma/schema.prismaのurlをLocal_DATABASE_URLに切り替えておく

今まで使ってきたmakeコマンドの一番後ろに```-local```をつけ環境を起動


初回は

```sh
npx prisma migrate dev --name init
```

とすること



