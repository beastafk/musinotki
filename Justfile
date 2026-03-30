project := "musinotki"
region  := "europe-west1"
service := "musinotki"
image   := region + "-docker.pkg.dev/" + project + "/" + service + "/" + service

deploy:
    docker build --platform linux/amd64 -t {{image}} .
    docker push {{image}}
    gcloud run deploy {{service}} \
        --image {{image}} \
        --platform managed \
        --region {{region}} \
        --allow-unauthenticated \
        --project {{project}}
