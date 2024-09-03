import attest from '@actions/attest'
import {bundleToJSON} from '@sigstore/bundle'

const main = async () => {
  const attestation = await attest.attestProvenance({
    subjectName: 'bin-linux.tgz',
    subjectDigest: { 'sha256': '40d117f04fa3970c2c852d2c6e0f5a9876fa8eb1c2e6ee6abe58bef58a7aa93a' },
    token: process.env.GITHUB_TOKEN,
    issuer: 'https://token.actions.githubusercontent.com/hammer-time',
  });

  console.log(JSON.stringify(attestation));
}

await main()
