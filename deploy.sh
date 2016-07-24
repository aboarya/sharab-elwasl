# temporary

initctl restart sharabelwasl
chown -R nginx:nginx /opt/sharab-elwasl
chown -R nginx:nginx /var/run/sharabelwasl/
service nginx restart