import attest from '@actions/attest'
import {bundleToJSON} from '@sigstore/bundle'
import {
  CIContextProvider,
  DSSEBundleBuilder,
  FulcioSigner,
  TSAWitness,
} from '@sigstore/sign'

const initBundleBuilder = () => {
  const identityProvider = new CIContextProvider('sigstore')

  const signer = new FulcioSigner({
    identityProvider,
    fulcioBaseURL: 'https://fulcio-staging.githubapp.com'
  })

  const witnesses = [
    new TSAWitness({ tsaBaseURL: 'https://timestamp.githubapp.com' })
  ]

  // Build the bundle with the singleCertificate option which will
  // trigger the creation of v0.3 DSSE bundles
  return new DSSEBundleBuilder({signer, witnesses, singleCertificate: true})
}

const signPayload = (payload) => {
  const artifact = {
    data: payload.body,
    type: payload.type
  }

  // Sign the artifact and build the bundle
  return initBundleBuilder().create(artifact)
}

const main = async () => {
  // EASY-MODE
  //const attestation = await attest.attestProvenance({
    //subjectName: 'bin-linux.tgz',
    //subjectDigest: { 'sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    //token: process.env.GITHUB_TOKEN,
    //sigstore: 'github',
    //issuer: 'https://token.actions.githubusercontent.com/hammer-time'
  //});
  //console.log(JSON.stringify(attestation));

  // HARD-MODE
  const predicate = await attest.buildSLSAProvenancePredicate("https://token.actions.githubusercontent.com/hammer-time");

  const sub = {
    name: 'bin-linux.tgz',
    digest: { 'sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  }

  const statement = {
    "_type": "https://in-toto.io/Statement/v1",
    subject: [ sub ],
    predicateType: "https://in-toto.io/attestation/release/v0.1",
    predicate: predicate
  }

  const bundle = await signPayload({
    body: Buffer.from(JSON.stringify(statement)),
    type: 'application/vnd.in-toto+json'
  })

  console.log(JSON.stringify(bundleToJSON(bundle)))
}

await main()
