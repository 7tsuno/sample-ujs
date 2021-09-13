# lernaでUniversal JSを試してみる

[動作サンプル](https://sample-ujs.vercel.app/)


![image.png](https://chaneso-crowi.s3.amazonaws.com/attachment/613ac4535017d000470e3f16/a54aeba5b476346e266a44318be2b169.png)

## プロジェクトの動かし方

npm install
```
npm i
```

lerna install (各パッケージへの `npm i` 的なもの)
```
npx lerna bootstrap
```

lernaでビルド
```
npx lerna build
```

reactをlocalhost:3000で起動
```
lerna run --scope web-front start
```

## 以降つくったものの解説など

### 目的

共通的に使える入力チェック処理を作成し、実際に動くサンプルに組み込む

### 作ったもの

よくあるサインアップ画面

* 名前は必須
* メールアドレスは必須　かつ　形式チェック有り
* パスワードは必須　かつ　8文字以上

### ディレクトリ構成

```
─── packages
    ├── common (共通処理)
    │  └── src
    │       ├── interface (型定義)
    │       └── validation (入力チェック)
    └── web-front (フロントエンド)
        └── src
             └── App.tsx (ReactのTSX)
```

`packages/common` に共通処理として入力チェックを置き、それを
`packages/web-front` のReactから呼び出している

lernaでのmonorepoな構成


### 入力チェック処理

```js

export default interface LoginInformation {
    name?: string,
    email?: string,
    password?: string
}

export interface ValidationResult {
    target: string
    message: string
}

export const ValidationMessage = {
    required: (name:string) => `${name}は入力必須項目です`,
    email: (name:string) => `${name}はemail形式である必要があります`,
    password: (name:string) => `${name}は8文字以上である必要があります`,
}


export const checkLogin = (target: LoginInformation):Array<ValidationResult> => {
    const result:Array<ValidationResult> = []

    // 必須チェック
    if(!target.name){
        result.push({
            target: "name",
            message: ValidationMessage.required('Name')
        })
    }
    if(!target.email){
        result.push({
            target: "email",
            message: ValidationMessage.required('Email Address')
        })
    }
    if(!target.password){
        result.push({
            target: "password",
            message: ValidationMessage.required('Password')
        })
    }
    
    // 形式チェック
    if(target.email && !target.email.match(/.+@.+\..+/)){
        result.push({
            target: "email",
            message: ValidationMessage.email('Email Address')
        })
    }

    // 列の長さチェック
    if(target.password && target.password.length < 8){
        result.push({
            target: "password",
            message: ValidationMessage.password('Password')
        })
    }

    return result
}
```

こんな感じ。ポイントは処理も返却値もUIに依存させないこと。`checkLogin` が入力チェック処理で、エラーが発生している場所とエラーメッセージを配列で返してあげている


例えば
```js
checkLogin({
  name: 'tanaka',
  email: '',
  password: 'pass'
})
```
というように呼ばれると返却値は
```js
[
  {
    target: 'email',
    message: 'Email Addressは入力必須項目です'
  },{
    target: 'password',
    message: 'Passwordは8文字以上である必要があります'
  }
]
````
という風になる。
この返却値はUIに依存していないので、フロントでもバックエンドでも(モバイルでも多分)利用できる

### フロントの実装

フロント側の実装は
```js
  // フォームの内容
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // 入力チェック
  const checkResults = useMemo(() => {
    const loginInformation = {
      name,
      email,
      password
    }
    return checkLogin(loginInformation) // ←ここでcheckLoginを呼んでいる
  },[name,email,password])
```

こんな感じの実装を行い、必要に応じてエラーメッセージをリアルタイムに出力させている。
詳細な実装は[App.tsx](https://github.com/7tsuno/sample-ujs/blob/master/packages/web-front/src/App.tsx)を見てほしい。
実際には初めてonBlurが走ったときに入力チェックを行うようにしている。

### バックエンドの実装

バックエンド側を作るのがだるくなったのでバックエンドのロジックはないが、バックエンドでもこの入力チェックを使って返却された値をレスポンスに詰めてあげればいいことは想像できる。
