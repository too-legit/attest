import attest from '@actions/attest'
import {bundleToJSON} from '@sigstore/bundle'

const main = async () => {
  const attestation = await attest.attestProvenance({
    subjectName: 'bin-linux.tgz',
    subjectDigest: { 'sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    token: process.env.GITHUB_TOKEN,
    issuer: 'https://token.actions.githubusercontent.com/hammer-time'
  });

  console.log(JSON.stringify(attestation));
}

await main()
