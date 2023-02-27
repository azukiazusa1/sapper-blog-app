---
id: 3i91qJrvc5Xk0QmjCkBC3M
title: "KubernetesのパッケージマネージャーHelm"
slug: "kubernetes-helm"
about: "Helmは、Kubernetsのパッケージマネージャーです。 例えば、npmを利用して第三者が作成したパッケージをレポジトリで管理して検索・インストールするように、Helmではチャート(Chart)と呼ばれる設定ファイルをレポジトリで管理しています。"
createdAt: "2021-03-14T00:00+09:00"
updatedAt: "2021-03-14T00:00+09:00"
tags: ["Kubernetes"]
published: true
---
Helm は、Kubernets のパッケージマネージャーです。
例えば、npm を利用して第三者が作成したパッケージをレポジトリで管理して検索・インストールするように、Helm では**チャート（Chart）**と呼ばれる設定ファイルをレポジトリで管理しています。

Docker Hub のようにイメージ自体を直接扱わないで、あくまで設定ファイルのみを管理しています。

今回は Helm を利用して WordPress 環境を構築してみます。

# インストール

公式の手順を参考にインストールします。

[Helm のインストール］[1]。

MacOS の場合、Homebrew でインストールできるようです。

```sh
$ brew install helm
```

# Helm チャートリポジトリの追加

Helm を利用するために、チャートを管理するためのリポジトリを追加する必要があります。
もっとも一般的な公式の stable チャートレポジトリを追加します。

```sh
$ helm repo add stable https://charts.helm.sh/stable
"stable" has been added to your repositories
```

# チャートの検索

追加したチャートレポジトリから、WordPress のチャートを検索してみます。
チャートを探すには、`helm search` コマンドを利用します。

```sh
$ helm search repo wordpress
NAME            	CHART VERSION	APP VERSION	DESCRIPTION                                       
stable/wordpress	9.0.3        	5.3.2      	DEPRECATED Web publishing platform for building...
```

チャートレポジトリ上に公開されている WordPress チャートが見つかりました。

なお登録したレポジトリはローカルにキャッシュされるため最新の情報が入手できない可能性があります。
そのような場合には、`helm repo update` コマンドでレポジトリの情報を更新にします。

```sh
$ helm repo update
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
```

# チャートのインストール

Helm では、チャートを使ってアプリケーションをデプロイすることを**インストール（install)**と呼び、インストールされたアプリケーションのインスタンスは**リリース（Release）**と呼びます。

レポジトリで公開されているチャートを使ってインストールする場合には。`helm install ＜Release名＞ ＜Chart名＞` コマンドを実行します。

先ほど検索でヒットした WordPress チャートをインストールしましょう。

```sh
$ helm install wordpress stable/wordpress
WARNING: This chart is deprecated
NAME: wordpress
LAST DEPLOYED: Sat Mar 13 23:05:50 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
NOTES:
This Helm chart is deprecated

# 省略
```

どうやら Deprecated のようです。

公式レポジトリの他に、[Chart Hub][2]と呼ばれる複数の Helm レポジトリを統合して検索可能なサービスがあります。
こちらを追加して検索してみましょう。

```sh
$ helm search hub wordpress
URL                                               	CHART VERSION 	APP VERSION   	DESCRIPTION                                       
https://hub.helm.sh/charts/groundhog2k/wordpress  	0.3.0         	5.7.0-apache  	A Helm chart for Wordpress on Kubernetes          
https://hub.helm.sh/charts/bitnami/wordpress      	10.6.12       	5.7.0         	Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/seccurecodebox/old-w...	2.5.2         	4.0           	Insecure & Outdated Wordpress Instance: Never e...
https://hub.helm.sh/charts/presslabs/wordpress-...	0.11.0-alpha.0	0.11.0-alpha.0	Presslabs WordPress Operator Helm Chart           
https://hub.helm.sh/charts/presslabs/wordpress-...	0.10.4        	v0.10.4       	A Helm chart for deploying a WordPress site on ...
https://hub.helm.sh/charts/gh-shesselink81-publ...	1.0.8         	5.7.0         	Web publishing platform for building blogs and ...
https://hub.helm.sh/charts/seccurecodebox/wpscan  	2.5.2         	latest        	A Helm chart for the WordPress security scanner...
https://hub.helm.sh/charts/presslabs/stack        	0.10.4        	v0.10.4       	Open-Source WordPress Infrastructure on Kubernetes
```

いくつか見つかりましたが、https://hub.helm.sh/charts/bitnami/wordpress のレポジトリが WordPress 公式が出しているチャートのようです。
このレポジトリを追加します。

```sh
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm install my-release bitnami/wordpress
```

```sh
$ helm install my-release bitnami/wordpress
```

# インストール時のステータス設定

インストールする際に、`--set` オプションでパラメータ設定をするか、YAML ファイルの設定を `-f ＜YAMLファイル＞` オプションで適用できます。

WordPress の場合は、以下のようにユーザーネーム・パスワード・データベースのパスワードを設定できます。

```sh
helm install my-release \
  --set wordpressUsername=admin \
  --set wordpressPassword=password \
  --set mariadb.auth.rootPassword=secretpassword \
    bitnami/wordpress
```

# リリースのアップグレート

一度デプロイしたリリースをアップグレード可能です。
これによって、アプリケーションを更新したり、インストール時に指定したパラメータを変更できます。

下記の例では、リリースのアップグレードによってブログ名を変更しています。

```sh
$ helm upgrade my-release stable/wordpress --set wordpressBlogName=MyBlog
```

# リリースのテスト

インストールしたチャートが適切に動作しているかどうか確認するために、`helm test` コマンドを利用できます。
なおチャートによっては提供されていないものもあります。

```sh
helm test my-releasse
```

# チャートを確認

それでは、今回利用したチャートが実際にどのような構造で作られているのか確認してみましょう。
`helm pull` コマンドでチャートをダウンロードできます。

```sh
$ bitnami/wordpress bitnami/wordpress
```

ダウンロードされたチャートは gzip で圧縮されているので解凍します。

```sh
$ ls
wordpress-10.6.12.tgz
$ tar xvzf wordpress-10.6.12.tgz
```

解凍されたファイルの次のようなパッケージ構造は次のとおりです。

| Header     | Header     |
| ---------- | ---------- |
| `template/*.yaml`       | インストールするマニフェストのテンプレート       |
| `template/tests/*.yaml`       | インストールしたチャートが正常に動作するかテストするマニフェスト       |
| `values.yaml`       | ユーザーが後から上書き可能なデフォルト定義       |
| `templates/NOTES.txt`       | `helm install` 時に出力するメッセージ       |
| `requirements.yaml`       | 依存するチャートとそのバージョンを記載       |
| `templates/_helpers.tpl`       | リリースの名前をもとに変数を定義するなど、ヘルパー変数の定義      |
| `Chart.yaml`       | チャートのメタデータ    |

マニフェストのテンプレートの中身を一部確認してみます。

```yaml
apiVersion: {{ include "common.capabilities.deployment.apiVersion" . }}
kind: Deployment
metadata:
  name: {{ include "common.names.fullname" . }}
  labels: {{- include "common.labels.standard" . | nindent 4 }}
    {{- if .Values.commonLabels }}
    {{- include "common.tplvalues.render" ( dict "value" .Values.commonLabels "context" $ ) | nindent 4 }}
    {{- end }}
  {{- if .Values.commonAnnotations }}
  annotations: {{- include "common.tplvalues.render" ( dict "value" .Values.commonAnnotations "context" $ ) | nindent 4 }}
  {{- end }}
```

このテンプレートに埋め込まれる値が `values.yaml` に定義されています。

# 独自チャートの作成

1 からチャートを作成したい場合は、`chart create` コマンドを使用します。
このコマンドは、さきほどのようなチャートのひな形を作成してくれます。

```sh
$ helm create my-chart
Creating my-chart
$ tree my-chart/
my-chart/
├── Chart.yaml
├── charts
├── templates
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml

3 directories, 10 files
```

作成したチャートを Helm レポジトリで提供する際には、taz 形式でパッケージ化しておく必要があります。パッケージ化を行う場合には、`helm package` コマンドを利用します。

```sh
$ helm package my-chart
Successfully packaged chart and saved it to: /my-chart-0.1.0.tgz
```

# 参考

[事実上の標準ツールとなっているKubernetes向けデプロイツール「Helm」入門](https://knowledge.sakura.ad.jp/23603/)
[Kubernetes完全ガイド 第2版](https://www.amazon.co.jp/dp/4295004804)

