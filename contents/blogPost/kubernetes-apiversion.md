---
id: 2AftnK6h3YryPz5lRNE9o9
title: " KubernetesのapiVersion"
slug: "kubernetes-apiversion"
about: "Kubernetesのマニフェストを作成するときには、`apiVersion`フィールドを指定する必要があります。 例えば`Pod`の場合には`v1`を、`Deployment`の場合には`apps/v1`を指定しますが、これらはどのようなルールで記述するのでしょうか。"
createdAt: "2021-05-09T00:00+09:00"
updatedAt: "2021-05-09T00:00+09:00"
tags: ["Kubernetes"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4NwI8gjd802es2aMCmWay7/5b1d1468d43c4ffc3623b33decec3eea/k8s.png"
  title: "kubernets"
selfAssessment: null
published: true
---
Kubernetes のマニフェストを作成するときには、`apiVersion` フィールドを指定する必要があります。
例えば `Pod` の場合には `v1` を、`Deployment` の場合には `apps/v1` を指定しますが、これらはどのようなルールで記述するのでしょうか。

# APIグループとAPIバージョンの指定

Kubernetes の API は API の種類に応じて API グループに分類されます。さらに API バージョンによって世代管理されています。
マニフェストに `apiVersion` を記述するときには `APIグループ/APIバージョン` というルールに従って記述します。

例えば、`Deployment` は `apps` グループに所属しているので `apps/v1` のようになります。
リソースと API グループの対応は `kubectl api-resources` で出力できます。

Kubectl のバージョンは `v1.20.0` で確認しました。

```sh
kubectl api-resources 
NAME                              SHORTNAMES   APIVERSION                             NAMESPACED   KIND
bindings                                       v1                                     true         Binding
componentstatuses                 cs           v1                                     false        ComponentStatus
configmaps                        cm           v1                                     true         ConfigMap
endpoints                         ep           v1                                     true         Endpoints
events                            ev           v1                                     true         Event
limitranges                       limits       v1                                     true         LimitRange
namespaces                        ns           v1                                     false        Namespace
nodes                             no           v1                                     false        Node
persistentvolumeclaims            pvc          v1                                     true         PersistentVolumeClaim
persistentvolumes                 pv           v1                                     false        PersistentVolume
pods                              po           v1                                     true         Pod
podtemplates                                   v1                                     true         PodTemplate
replicationcontrollers            rc           v1                                     true         ReplicationController
resourcequotas                    quota        v1                                     true         ResourceQuota
secrets                                        v1                                     true         Secret
serviceaccounts                   sa           v1                                     true         ServiceAccount
services                          svc          v1                                     true         Service
mutatingwebhookconfigurations                  admissionregistration.k8s.io/v1        false        MutatingWebhookConfiguration
validatingwebhookconfigurations                admissionregistration.k8s.io/v1        false        ValidatingWebhookConfiguration
customresourcedefinitions         crd,crds     apiextensions.k8s.io/v1                false        CustomResourceDefinition
apiservices                                    apiregistration.k8s.io/v1              false        APIService
controllerrevisions                            apps/v1                                true         ControllerRevision
daemonsets                        ds           apps/v1                                true         DaemonSet
deployments                       deploy       apps/v1                                true         Deployment
replicasets                       rs           apps/v1                                true         ReplicaSet
statefulsets                      sts          apps/v1                                true         StatefulSet
tokenreviews                                   authentication.k8s.io/v1               false        TokenReview
localsubjectaccessreviews                      authorization.k8s.io/v1                true         LocalSubjectAccessReview
selfsubjectaccessreviews                       authorization.k8s.io/v1                false        SelfSubjectAccessReview
selfsubjectrulesreviews                        authorization.k8s.io/v1                false        SelfSubjectRulesReview
subjectaccessreviews                           authorization.k8s.io/v1                false        SubjectAccessReview
horizontalpodautoscalers          hpa          autoscaling/v1                         true         HorizontalPodAutoscaler
cronjobs                          cj           batch/v1beta1                          true         CronJob
jobs                                           batch/v1                               true         Job
certificatesigningrequests        csr          certificates.k8s.io/v1                 false        CertificateSigningRequest
leases                                         coordination.k8s.io/v1                 true         Lease
endpointslices                                 discovery.k8s.io/v1beta1               true         EndpointSlice
events                            ev           events.k8s.io/v1                       true         Event
ingresses                         ing          extensions/v1beta1                     true         Ingress
flowschemas                                    flowcontrol.apiserver.k8s.io/v1beta1   false        FlowSchema
prioritylevelconfigurations                    flowcontrol.apiserver.k8s.io/v1beta1   false        PriorityLevelConfiguration
ingressclasses                                 networking.k8s.io/v1                   false        IngressClass
ingresses                         ing          networking.k8s.io/v1                   true         Ingress
networkpolicies                   netpol       networking.k8s.io/v1                   true         NetworkPolicy
runtimeclasses                                 node.k8s.io/v1                         false        RuntimeClass
poddisruptionbudgets              pdb          policy/v1beta1                         true         PodDisruptionBudget
podsecuritypolicies               psp          policy/v1beta1                         false        PodSecurityPolicy
clusterrolebindings                            rbac.authorization.k8s.io/v1           false        ClusterRoleBinding
clusterroles                                   rbac.authorization.k8s.io/v1           false        ClusterRole
rolebindings                                   rbac.authorization.k8s.io/v1           true         RoleBinding
roles                                          rbac.authorization.k8s.io/v1           true         Role
priorityclasses                   pc           scheduling.k8s.io/v1                   false        PriorityClass
csidrivers                                     storage.k8s.io/v1                      false        CSIDriver
csinodes                                       storage.k8s.io/v1                      false        CSINode
storageclasses                    sc           storage.k8s.io/v1                      false        StorageClass
volumeattachments                              storage.k8s.io/v1                      false        VolumeAttachment
```

## `core` グループ

ところで、`Pod` や `Service` などのリソースは `v1` とだけ指定します。これはなぜでしょうか。
これらは、`core` グループに属していますが、`core` グループの場合だけ API グループ名を省略し、バージョンだけを記載するようになっています。

## APIバージョニング

Kubernetes の API のバージョンは `Alpha`・`Beta`・`Stable` の 3 種類に分類されます。

| APIバージョン | 例 | 
| ---------- | ---------- |
| Alpha      | `v1alpha1` | 
| Beta       | `v2beta3`  |
| Stable     | `v1`       |
