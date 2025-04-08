### 初回セットアップ

```sh
make init
```

```sh
make [mack, win, linux]-app
```

---

これで確認してください

**.envがないので、各自で設定することになります。**


⚠️ **注意:** mainに直接pushしないでください。developを用意しているのでそれを編集し、push, fetch, margeしてください


その他のmakeコマンドはMakefileにおいています

----

### 新しい要素を追加する(コードを書く)場合

**developから**

```sh
git checkout -b future/〇〇
```

として新しいブランチを作成してから編集してください

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
git checkout develop
```

```sh
git marge --squash future/〇〇
```

```sh
git commit -m "⬜︎⬜︎"
```

```sh
git push origin develop
```

するのがいいかなと思います。