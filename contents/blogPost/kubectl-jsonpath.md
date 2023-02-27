---
id: 6HOQxhocB2BVXjIGjwgwvS
title: "kubectl JSONpath"
slug: "kubectl-jsonpath"
about: "kubectlはアウトプットの形式としてJSONPathをサポートしています。"
createdAt: "2021-04-25T00:00+09:00"
updatedAt: "2021-04-25T00:00+09:00"
tags: ["Kubernetes"]
published: true
---
# JSON Path

kubectl はアウトプットの形式として JSONPath をサポートしています。

https://kubernetes.io/docs/reference/kubectl/jsonpath/

```sh
kubectl get pods -o=jsonpath='{ .items[0].spec.containers[0].image }' 
```

## 例

次の Node の定義に対する jsonpath の出力結果を確認します。

```json
{
  "apiVersion": "v1",
  "items": [
    {
      "apiVersion": "v1",
      "kind": "Node",
      "metadata": [{
        "name": "master"
      }],
      "status": {
        "capacity": {
          "cpu": "4"
        },
        "nodeInfo": {
          "architecture": "amd64",
          "operationgSystem": "linux"
        }
      }
    },
    {
      "apiVersion": "v1",
      "kind": "Node",
      "metadata": [{
        "name": "node01"
      }],
      "status": {
        "capacity": {
          "cpu": "4"
        },
        "nodeInfo": {
          "architecture": "amd64",
          "operationgSystem": "linux"
        }
      }
    },
  ]
}
```

```sh
$ kubectl get nodes -o=jsonpath='{.itmes[*].metadata.name}'
master node01
```

```sh
$ kubectl get nodes -o=jsonpath='{.items[*].status.nodeInfo.architecture}'
amd64 amd64
```

```sh
$ kubectl get nodes -o=jsonpath='{.items[*].metadata.name} {.items[*].status.capacity.cpu}'
master node01 4 4
```

`{"\n"}` で改行を `{"\t"}` でタブを出力できます。
```sh
$ kubectl get nodes -o=jsonpath='{.items[*].metadata.name} {"\n"} {.items[*].status.capacity.cpu}'
master node01 
4 4
```

```sh
kubectl get nodes -o=jsonpath='{range .items[*]} {.metadata.name} {"\t"} {.status.capaticy.cpu {"\n"} {end}'
```

- カスタムカラム

カスタムカラムは、コンマ区切りされたカスタムカラムのリストを指定してテーブルを表示します。

```sh
kubectl get nodes -o=custom-columns=<COLUMN NAME>:<JSON PATH>
```

```sh
kubectl get nodes -o=custom-columns=NODE:.metadata.name
NODE
master
node-1
```

- ソート

```sh
kubectl get nodes --sort-by=.metadata.name
NAME   STATUS ROLES  AGE VERSION
master Ready  master 5m  v1.11.3
node01 Ready  <none> 5m  v1.11.3
```

