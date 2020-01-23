/**
 * @module authCfg Configuration of auth tokens and password encryption.
 */

module.exports = {
    tokenSecretKey: 'Unus pro omnibus, omnes pro uno.',
    tokenExpirationSecs: 1* 24 * 60 * 60,
    passwordHashAlgorithm: 'sha512',
}