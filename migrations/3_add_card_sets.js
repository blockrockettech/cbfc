const KOTA = artifacts.require('KOTA');
const _ = require('lodash');

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = 'nbCbdzC6IG9CF6hmvAVQ';
let mnemonic = require('../mnemonic');

module.exports = async function (deployer, network, accounts) {

  console.log(`KOTA adding card sets to ${network}...`);

  const deployedKOTA = await KOTA.deployed();

  let _owner = accounts[0];

  if (network === 'ropsten' || network === 'rinkeby') {
    _owner = new HDWalletProvider(mnemonic, `https://${network}.infura.io/${infuraApikey}`, 0).getAddress();
  }

  if (network === 'live') {
    let mnemonicLive = require('../mnemonic_live');
    _owner = new HDWalletProvider(mnemonicLive, `https://mainnet.infura.io/${infuraApikey}`, 0).getAddress();
  }

  console.log(`_owner = ${_owner}`);

  const kodaIpfsCache = {
    "for_the_girls_and_boys": "QmYnZbjW4F3Zsa2eqPcaaqu6iK84mySQC7qgqH3em3d2Lb",
    "buzz": "QmPuEcNENsbRV1GyUV4uY4VvxjZ1Rwg7cDoQ2NcAvbhGVz",
    "lending_a_hand_3": "QmYwt75bLMCPyxBpLjggiWSHSBksqhC3r9HD2C1mi2M8dd",
    "family_tree": "QmYtPBJyn2Mtvo6uhusHZS9oVyzzGTTLxE4heMBQpA7xpv",
    "lending_a_hand_2": "QmdR1eKegUvaaLa7ubu62HF3jqJwLCjm14aQsjsLXmyYpL",
    "tephra_ip0250": "QmNueAJb5AXCUQkVDKK77gykLbHu9oMvQg9bxDmw6EBgHj",
    "start_me_up": "QmVCTpnjHBPQxCMY6S3c1JknZJeTW5gKxWvtLcfvRCyLrt",
    "manchester": "QmZsEYjbPw3tiTPpce41FUJKTmPxRcrnb9EMrZ1BUCTZ5J",
    "bryan_edmondson_inc": "QmWhUwLDjP7A3rfBHHcYydxao77YRAjr6234hHpWbNoJM1",
    "tephra_ip138": "QmW4ZCrP1zrC6N9mw3gsCzf1DYLZcXr5WJccwH96XYUjJr",
    "poker_face": "QmfLz3LBzQgju1k1u7mmuQyYb2s8taFtRC2uypLHrCiAeq",
    "tephra_ip0100": "QmQn7Dq6Nj84FdR5FKfWFTqqJmXAdWNBYt3TqEnTqeXTxh",
    "berlin": "QmTX9gJT19LhLNs44NYNnfq3DnMCrUumASP3dSJwWnQYFB",
    "lam_untitled_2011_1": "Qmc7ViiSeJwxRF8fhCdp6jKFixoKXsv1Soxfw8srsDtsdQ",
    "lam_untitled_2011_3": "QmeTxdwvy9KobkJVHrSWNoMzD7qM1UMzGxMbqfMyGGs3VW",
    "lam_untitled_2011_2": "QmQocUMCWAFnzxvcwQrt64LgP9pmccFNBBfw1rgb1vtidw",
    "peep": "QmQUF5WDQNpahXuoVG6g22jU6HG9jVRMG2Jn9QMo7EMAUz",
    "lisbon": "QmczAcafyGNWMVkr9DMCDRCDBEnx1h6FncAGZpgR8KQoau",
    "coin_journal_coinfest_day": "QmWkvzRzHQGm5GbsY2t7Sexn29HMomKP8B93oftwNSs3AF",
    "inside_earth": "QmewYc4vNnHDjSdCaUBXec8Xj6XDE2BpLpYWKwMFnD5bWd",
    "coin_journal_blockchain_colouring": "QmYpb5maZziZa8XQs367VSjrBxNMuD2P2GZ9FnBJwPVeDJ",
    "coin_journal_coinfest_night": "QmY4dPtWemsfNSVeeMB6FrzaFjzKEtndwR2DYArFNGatyu",
    "roar": "QmPo9kNRHaw5cwdsFuKKNegMvPuzeky6nxTVwLCTwquNBz",
    "frank_sidebottom": "QmVpNmoP7F6iCM8Hx1fvYqksPsaQoVX3CZNxuR3fMhpczF",
    "sch_the_green_lady": "QmdPEDZDinHqz8pzxwxWMudBJjEhvXvMXYMWh8zYUxTuxa",
    "nature_boy": "QmYPtb5LyPBjQo6maKCeSqhMHk9LsaNGepMfU9Fn8Q8Zte",
    "pattern_play_1": "QmdbeH9kcnJWVzp965YAndnuvDnin4AqrmFeUSZBTUWLiA",
    "loose_tapestries": "QmeFxMxCBD8qk91eamzGQEyr7doAUPDKvy2ymx2hAhAkQG",
    "pace_of_life": "QmcME1qNa1wNmyQNcaWaLd4r28y1j7K8kZZ3xCDcQKGhVS",
    "cotton_and_path_sample_3": "QmTYsKsebm9vUd7ssZuuHedvsQPND9QEfqiYhqgGVPnnPJ",
    "cotton_and_path_sample_2": "QmTnycHKG1L2xMc5SNbjGjvXFuegsmsEaJ9e2TJe157yF6",
    "cotton_and_path_sample_4": "QmS6cKax31N8RzMZyvrsL7RpJuMUaDs3sMmwMkCzZ3D9nw",
    "cotton_and_path_sample_1": "QmVeuNRG7rXfnFvBADD721cmdE6kApiMfn6hfkk1dtgKYk",
    "acid_rain_tuesday": "QmNZ6w6PPhpM8kMVYJjZq94GLFonzrWhfz67PjmQYKPxYV",
    "coin_journal_disrupting_finance": "QmWgZHLgoP4Ck9j6fnJY2utB864smvGjnYbYuL35EkvbZq",
    "neue_haas_unica": "QmX13JyQeEMHFs3kKVPiGBNicamch5gyf46RWg9ARQaJB3",
    "boo": "QmdU2jFym9padrzCBrH1ADz277qkug4gXRXhZAHVREzJKY",
    "89a_up_and_down": "QmX8MoKPQZNCRz34u24Ah9UQcjYKTNfuxHJA1WhHdxdJiV",
    "89a_wake": "QmSzvg5qJusbSyDPE1DHaotP44aXjNMQqes95F6L9YHYMq",
    "89a_kurushi": "Qmd9N4GpbdcTQVEPueeFUdv9rm5EWjniu9EKhcTFDmDmrX",
    "leeds": "QmNMEuq36Fw7frDNTkHqD841RrQaSzvd7nc5KHBEj3EAMJ",
    "stina_jones_happy_fox": "QmZ9NQCuCrgD8UW36kgxUcceGdaT5h5VbFTUax2FYPomqX",
    "paris_salter_red": "QmYooVHGsAoPoM9uWpSYvEA9Hz264eqVyDy53ZwfKvdhFx",
    "aktiv_protesk_void": "QmdH4J3vhRE7qEJZWFvLaFmvo5WDoczcjndJGkFf4xnutp",
    "paris_salter_blue": "QmVuAWunBXXsLQbo5NZyozqbngdRdykuwuwe1DHiCKUfKY",
    "aktiv_protesk_filament": "QmRgRG5LCfAbFLxg8e6TZLDK9kBGTpRopJRxrG2ex1rqCo",
    "aktiv_protesk_stellar": "QmVTDkwubtkzG9KofFpQ7d9MPn8DgXarrUCEr3MuhpFpYj",
    "paris_salter_green": "QmdvJxRb2kV9riwzAdoZ1M29AVbda1ktt3waxdcgKUmyXY",
    "aktiv_protesk_pebble": "QmQwHSwu2iTPF5FVBHNL7TNmg2birznkTg4sFRiF8Wd9Vo",
    "mike_lewis_sooty_milkcap_mandala": "QmR8evC4JEa135yiaQXYBauPTWW2vRoaF5c3BsAjZPCJiY",
    "lee_holland_priestess": "QmaRLAyMpNkpPVw75zgZVGSQq6Y7hEKpFNpANW34uTsCrH",
    "tony_smith_face_in_the_flames": "QmXSMk8jhLDsWMrFhVaA4iorjPLT4EqPCsksYtgfCGYxKD",
    "tony_smith_theyre_watching": "Qma87ZEPM5JVW9TZwgF4cVRkbWfCnLzwZJQDruq5ti63WG",
    "tony_smith_poppies_in_the_evening": "Qmc6Y2ngzLSHYRg8KLQgwJhikHa77UGJeS64CpcMYgCQVo",
    "tony_smith_depressed": "QmdQufzCAvzvdC7fiaY788VR3xmDMm28XGfQ2QnhPhEcFo",
    "obxium_ddf1": "QmSKFZiGYupMWj34pP2DNM6QwAi328hegSY1EdvKRXdaPs",
    "stina_jones_happy_friday_bird": "QmYC1CHvgaHsit4SrCdM5qBxHFSLBroe7Fuw4rokjRjKK2",
    "stina_jones_spring_morning": "QmZLwcWfoWprBrwNMHmwdVjusBoChnpdRxXH5ysbDL2HLM",
    "stina_jones_running_riot": "QmZZZYtNL76GybxkyZCLVuzf4wJXDKbks57RAfmWYsMc9W",
    "stan_ragets_emoji_no1": "QmNvBCKVFAantUX3UG93UJnjtRepCW3Wm7kYBh7epMfgKa",
    "stan_ragets_liquify": "QmSBN8zqqoZvknF5PZjTqgS8mTQeXquNM9mFR4Z3mgx434",
    "stan_ragets_taming_the_lion": "QmPNHQ66BQTUWpbhb4vUZjpsuZ4HCXAC96UcbDnmNiQvoR",
    "stan_ragets_treating_the_symptoms": "QmQKv7aJucW11XKvmzUc6CddWRF7n6w63dE28TWSjMDwUw",
    "franky_aguilar_hype_death_of_the_scotty": "QmUYY3LmsqHtruuCWwjTC4EsgbdkkZ7zLEo3gQDvyrgRC6",
    "franky_aguilar_daffy_rain": "QmeLxUi7trfYB2EY6aZ2WfeuiJRSWSdNmdhzi57P7jt3Lq",
    "stan_ragets_too_many_noodles": "QmUuQmqpqZv9vyhy8HpAB14odZaRifteJ5zrJ4makq4sLH",
    "stan_ragets_grass_roots": "QmaTYHj9DzyQLHmjoDq8K6Uj8GZHioV6irpu5jeBpjxd7z",
    "stan_ragets_soft_face": "Qmbgc7xgU5bDDwkJfEEyRW1EdsHHwt7sq6AbadL95huWhS",
    "franky_aguilar_insta_tweety": "QmUkQDkrkxEg5mUQdM1iH1K3F1uJXmDK3ceVPfg8hHS4pz",
    "franky_aguilar_martian_bang": "Qma5erf8N2YU64myn8SBPgEFDDhE4VToAaTYcvVJALRhWM",
    "franky_aguilar_bunny_bags": "QmSErLQkxawcBqBfSrtoRZDJzdDxK6pEyLYFLxfHQEXeLt",
    "franky_aguilar_burning_fiat": "QmPQ7WcYJeDXbRJDTyhVYV3SZKLLpgoeqLid4mxYPXQ3zY",
    "obxium_ddf5": "QmYmssaNPKZLq5dTQddGTUTA6tas5sSvChZGfrPuoywQEh",
    "takahiro_okawa_taka": "QmT5ATCMKrXu3KTafuoJGYvC4vBQfVt3PuFVGQxTEoxYav",
    "manoloide_neopla": "QmbTmXPL5F5pttPUJsMwctG2o9SWUGrAVXGpXZeHenovMZ",
    "loseva_art1": "QmZ64rsedoh7GWCdcD5roG9ceEPKConDMEejnW9S9xxHnS",
    "loseva_art2": "QmdpsyWiFh8a1Lh5BhnpP4RSkmADU4HQNVLNqC2XcuymCY",
    "loseva_art3": "QmPyX5uJX19ihncWPwUG5AKFx6uQB2vNb21HCLaCckUirf",
    "stan_ragets_miracle": "Qme4Uzb7RPLRUJ2Zb31E4ddfqUAtTPnbeTEe5AEdfVUbyb",
    "stan_ragets_apparently_aimless": "QmPtcQ6pKYhFWyqsPdzysixZnFzbNnEEgUszuc5ymri5aC",
    "lee_holland_bitopian": "QmdLRyaCtZCGBWb7V6vBnWFyfz6WQcj65K6Ar2waTRYbMz",
    "lee_holland_ethereum_inside": "QmTFfsWwJDKm8sGcXjmDobtK1hHnsKUfMQ4cfwKKjFpEzo",
    "lev_punkin": "QmeeFoyeGzbHMeotHNrJQyR3WZkdLnRhARRqhPHpUV4hVs",
    "lev_hornsbee": "QmceW4i1m5XVXmzNHVX2hchR3NT2xYVDnuf5c2U7ptuKrJ",
    "lev_pigalow": "QmXW5PLsqZWR5M8sGFo2hsqpWGPkza9BBmFEDewBq5MVbN",
    "lev_hornsbin": "QmaaK5Xk12bhnfWp4366JZU6mNmG15LUyg9gXRq2vwWTEN",
    "mlo_tamed_one": "QmYpFifMm2LEqpmn4yVopPWVB9cyqtwiWG18jnKvBvTJFG",
    "mlo_tamed_two": "QmbbhaHdw4D4eS6dyHJ5ebkByU3qerZMJ85zptcy9B5jM2",
    "lev_trigalow": "QmNu91p6RFodeE8nB4YzfEPkRMDP5zM1jrrQyVWqxDa652",
    "obxium_ddf2": "QmXVVZU7HseWdsDDsarQ6EPo9KSYX9CFy4VrfKYzWDF33v",
    "obxium_ddf3": "QmSdS6wUcwDEoiPFBwt1ujSgcZmw5Zwcu56x96pFAx7uSw",
    "stina_jones_bdot": "QmQ9BGkKHhJnBag8dRbjFCyJdbtsSfK93yYr1eqGBEDPXy",
    "drawingly_willingly_devilish_run": "QmWC639z6D9Mo9j8fKSa8gvn4uSHbfPfB3U2fceg1VJSw5",
    "mlo_emerging_shapes_1": "QmQXaq9kEAN8jGko3p6CTxwHaYDPa2xcuvaCDrWuxVYVw2",
    "mlo_emerging_shapes_2": "QmWYHFrHpyYUUVgR58WVUVnvmLpEhs133XJFKdZCSLXE8d",
    "mlo_emerging_shapes_3": "QmQxYJTwjgaXJWqnE3wZmAXNYfFQWydd7jTpqiVP9CSZcc",
    "hackatao_they_live": "Qmav393uKBvWXWBBWRCAa3yUNgXxPiEWePdrtpcLUWGNrv",
    "lev_ethermanf": "QmPzk5raHryh278i1aYXS1j7aEZqKGQ1dhvJGzXMttvMFp",
    "hackatao_own_me": "QmXCWEWE4FggifgUfqWgN2DZCPm8DV26gQvLzwSqvafzPL",
    "hackatao_like_a_human_1": "QmborrEQ2etM5smfTLUKANgwTw7U1SZDSmsx2kx5ywdc1F",
    "hackatao_like_a_human_2": "Qma6FKEFYTpdHWpMJHe3QWMKzE67YiochhjZMKL9hzPCi1",
    "aktiv_protesk_melt": "QmTu54dUw3Jn2HjiC5HDh31hHPVE1dHBcn3BHHUeps2WTN",
    "aktiv_protesk_tempo": "QmPBDAedauUJUz4Fw9skwuY6ZnF9PtE4VRvjvkwbWWhnru",
    "coin_journal_coin_zuki": "QmfPHJGGq2sSia4d9osWw7T2STJbMw7RJz6x1PLDv8whqL",
    "hex0x6c_none_fungible_tokens": "QmPGucBRhFTVzP7nEdnmbh6654bLF5AnXtBLRBZvKhqCUV",
    "oficinas_tk_cells": "QmcCdppXXyQ4UboiUzse7iV5muMMRFmNrNZ9WVT1QYkW9B",
    "oficinas_tk_pebbles": "QmSskGXFG4MtHhbmeX9i1ukBmRiNJTeV3nG5em4FpmWDFj",
    "oficinas_tk_nr_418": "QmcESe9H27GKiykJei29og9ubezc3ZA241BikVKk3am3pC"
  };

  _.forOwn(kodaIpfsCache, async (k, v) => await deployedKOTA.addCardSet(1000, 100, k, v));
};
