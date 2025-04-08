### 目次
- 初めに
- 初回セットアップ
- ライブラリの追加
- 新しい要素を追加する(コードを書く)場合

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
git marge --squash future/〇〇  #developブランチにfuture/〇〇の変更を追加
```

```sh
git commit -m "⬜︎⬜︎"  #追加した変更にコメントを設定
```

```sh
git push origin develop  #developに適応
```

するのがいいかなと思います。

⚠️ **注意:** mainに直接pushしないでください。developを用意しているのでそれを編集し、push, fetch, margeしてください