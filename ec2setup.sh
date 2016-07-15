yum -y update
rpm --import https://packages.elastic.co/GPG-KEY-elasticsearch
cat <<EOF >> /etc/yum.repos.d/es.repo
[elasticsearch-2.x]
name=Elasticsearch repository for 2.x packages
baseurl=https://packages.elastic.co/elasticsearch/2.x/centos
gpgcheck=1
gpgkey=https://packages.elastic.co/GPG-KEY-elasticsearch
enabled=1
EOF
yum install -y elasticsearch java-1.8.0
chkconfig --add elasticsearch
service elasticsearch start
