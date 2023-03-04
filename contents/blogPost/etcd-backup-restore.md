---
id: 3TO4JeFhCHjWVjtuIAmjK1
title: "etcdのバックアップとリストア"
slug: "etcd-backup-restore"
about: "etcdは、kubernetesのクラスターの情報を保存するkey-valueストアです。"
createdAt: "2021-05-02T00:00+09:00"
updatedAt: "2021-05-02T00:00+09:00"
tags: ["Kubernetes"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4NwI8gjd802es2aMCmWay7/5b1d1468d43c4ffc3623b33decec3eea/k8s.png"
  title: "kubernets"
published: true
---
etcd は、kubernetes のクラスターの情報を保存する key-value ストアです。

etcd のバックアップ・リストアなどの操作は `etcdctl` コマンドを使用します。

[etcdctlのドキュメント](https://etcd.io/docs/)は CKA や CKAD の試験中には参照できないので注意してください。

普通にコマンドを実行しようとすると v2 のコマンドが使われてしまうので、v3 API を使うために基本的に `ETCDCTL_API=3` と環境変数を設定します。

# etcdのバックアップ

## static Podのetcdの定義を確認する

```sh
$ /etc/kubernetes/manifests
$ cat etcd.yamlcat etcd.yaml
```

`command` を確認します。

```sh
spec:
  containers:
  - command:
    - etcd
    - --advertise-client-urls=https://172.17.0.46:2379
    - --cert-file=/etc/kubernetes/pki/etcd/server.crt
    - --client-cert-auth=true
    - --data-dir=/var/lib/etcd
    - --initial-advertise-peer-urls=https://172.17.0.46:2380
    - --initial-cluster=controlplane=https://172.17.0.46:2380
    - --key-file=/etc/kubernetes/pki/etcd/server.key
    - --listen-client-urls=https://127.0.0.1:2379,https://172.17.0.46:2379
    - --listen-metrics-urls=http://127.0.0.1:2381
    - --listen-peer-urls=https://172.17.0.46:2380
    - --name=controlplane
    - --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt
    - --peer-client-cert-auth=true
    - --peer-key-file=/etc/kubernetes/pki/etcd/peer.key
    - --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --snapshot-count=10000
    - --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
```

下記の etcd のバックアップのコマンドを `command` で確認した値で置き換えて実行します。

```sh
ETCDCTL_API=3 etcdctl --endpoints=<advertise-client-urls> \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```

https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster

例えば、`<trusted-ca-file>` の部分は `--trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt` の値で置き換えます。

```sh
$ ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key \
  snapshot save backup.db
Snapshot saved at backup.db
```

確認を行います。

```sh
$ ETCDCTL_API=3 etcdctl --write-out=table snapshot status backup.db
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| 613180e5 |     7698 |       1435 |     2.6 MB |
+----------+----------+------------+------------+
```

# etcdのリストア

etcd のリストア方法には、リストア対象のファイルがさきほどの
バックアップの操作から続けて行われているか、別のディレクトリから行われているかで操作が異なります。
まずは前者の方法から見ていきます。

## リストア対象のファイルが同じ場合

以下のコマンドを実行します。

```sh
ETCDCTL_API=3 etcdctl --endpoints <advertise-client-urls> snapshot restore backup.db
```

## リストア対象のファイルが別のディレクトリの場合

`--data-dir` オプションでリストア先を指定します。

```sh
ETCDCTL_API=3 etcdctl  --data-dir /var/lib/etcd-from-backup \
     snapshot restore backup.db
```

その後、`/etc/kubernetes/manifests/etcd.yaml` を編集します。
さきほど `--data-dir` で指定したリストア先のディレクトリで `etcd-data` ボリュームを置き換えます。

```yaml
volumes:
  - hostPath:
      path: /var/lib/etcd-from-backup
      type: DirectoryOrCreate
    name: etcd-data
    ```

etcdはstatc Podとして動いているので、マニフェストを修正すると自動でpodが再作成されます。

https://github.com/mmumshad/kubernetes-the-hard-way/blob/master/practice-questions-answers/cluster-maintenance/backup-etcd/etcd-backup-and-restore.md#3-restore-etcd-snapshot-to-a-new-folder
