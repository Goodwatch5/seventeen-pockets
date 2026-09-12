# GCP Dataform IAM Binding Verification

This document outlines the GCP Dataform service account verification process for this project's deployment pipelines.

## Identity Reference

* **GCP Project Number:** `248946685771`
* **Service Account Email:** `iknewnothingnew@gmail.com`

## Verifying the Dataform IAM Binding

Run the following command to check that the Dataform service agent is correctly bound to the custom service account:

```bash
gcloud iam service-accounts get-iam-policy iknewnothingnew@gmail.com \
  --format="table(bindings.role,bindings.members)" | grep dataform
```

## Expected Output

The output should display the Dataform service agent for project `248946685771`:

```
service-248946685771@gcp-sa-dataform.iam.gserviceaccount.com
```

If this binding is not present, Dataform pipelines and integrations will fail to authenticate against this project.
