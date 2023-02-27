---
id: 47T8K6NXXVRp6jOkYQP5wX
title: "CKADにも合格した"
slug: "also-passed-ckad"
about: "開発者向けのK8sの試験であるCKADにも合格したので同様に合格体験記を記載したいと思います。 といっても、大枠の部分はCKAのときとあまり変わらないのでCKAと異なる部分を中心に記載したいと思います。"
createdAt: "2021-05-23T00:00+09:00"
updatedAt: "2021-05-23T00:00+09:00"
tags: ["Kubernetes"]
published: true
---
[前回CKAを受験して合格した記事](https://zenn.dev/azukiazusa/articles/30e5a2988c2dd9)を Zenn に書きました。

開発者向けの K8s の試験である CKAD にも合格したので同様に合格体験記を記載したいと思います。
といっても、大枠の部分は CKA のときとあまり変わらないので CKA と異なる部分を中心に記載したいと思います。

# 試験の概要

CKA は Kuberntes の管理者としてのスキルを認定する試験であるのに対して、CKAD は名前のとおり開発者としてのスキルを認定します。

> この認定は、Kubernetesによるクラウドネイティブアプリケーションの構築、デプロイ、構成を担当するKubernetesエンジニア、クラウドエンジニア、その他のITプロフェッショナルを対象としています。

https://training.linuxfoundation.org/ja/certification/certified-kubernetes-application-developer-ckad/

CKAD の出題範囲は以下のとおりです。

| 対象領域とコンピテンシー | 割合 |
| ---- | ---- |
| コアコンセプト | 13% |
| 構成 | 18% | 
| マルチコンテナPod | 10% |
| 可観測性 | 18% | 
| Podのデザイン | 20% |
| Serviceとネットワーキング | 13% |
| ステートの持続性 | 8% |

# 勉強方法

## [Kubernetes Certified Application Developer (CKAD) with Tests](https://www.udemy.com/course/certified-kubernetes-application-developer/)

安定と信頼の Udemy。CKA のコースと重複しているセクションも多いので、CKA を取得して間もないのであれば模擬試験だけ受けるのも良いかもしれません。

何度も言うようですがくれぐれもセール中以外に買わないように注意。

## [CKAD-exercises](https://github.com/dgkanatsios/CKAD-exercises)

出題範囲に合わせて一問一答形式でタスクが羅列されています。これをすべて解けば出題範囲はほぼ満たしていると言えます。
Kubernetes を実行する環境は自分で用意しなければいけないので注意です。

# 感想

CKA と比べて 2 時間で 19 問と出題数は多いですが、1 つ 1 つの問題の難易度自体はやさしいと感じました。
CKAD は「クラスターのバージョンをアップデートしろ」「どこかの Node が壊れているので直せ」といったように成功条件だけ与えられた方法も自分で探す方法があるのですが、CKAD の場合には加えて具体的な実装の方法も問題文として提供されているといった印象です。

1 つ 1 つの問題には配点の比重が記載されているのですが、明らかに問題の難易度と比重があっていないように感じました。
Pod を作成するだけの問題が 12%の比重だったのに、Pod の作成に加えてさらにいくつかの条件が課されているような問題がなぜか 2%しか比重がなかったりと問題にかかる時間と比重がどう考えても比例していません。

比重が 2 ~ 3%しかない問題は基本後回しにしてしまってよいでしょう。

CKAD の受験範囲が改定される予定らしいのです。
Helm を使ったデプロイなどより実践的な内容になっていますね。

https://training.linuxfoundation.org/ja/ckad-program-change-2021/

