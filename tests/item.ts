import { Bytes, Key, Nat, Option, Or, pair_to_mich, Signature, string_to_mich } from '@completium/archetype-ts-types'
import { blake2b, expect_to_fail, get_account, set_mockup, set_mockup_now, set_quiet } from '@completium/experiment-ts'

import { item } from './binding/item';

const assert = require('assert');

const alice = get_account('alice');
const bob = get_account('bob');
const carl = get_account('carl');
const user1 = get_account('bootstrap1');
const user2 = get_account('bootstrap2');


set_mockup()

set_quiet(true);

const now = new Date("2022-01-01")
set_mockup_now(now)

/* Scenarios --------------------------------------------------------------- */

describe('[Item NFT] Contracts deployment', async () => {
    it('Item contract deployment shoud succeed', async () => {
        await item.deploy(alice.get_address(), { as: alice })
    })
})

describe('[Item NFT] Pause', async () => {
    it('Set pause should succeed', async () => {
        await item.pause({
            as: alice,
        });
        const is_paused = await item.get_paused();
        assert(is_paused == true);
    });

})

describe('[Item NFT] Transfer ownership', async () => {
    it('Transfer ownership as non owner should fail', async () => {
        await item.unpause({
            as: alice,
        });
        await expect_to_fail(async () => {
            await item.declare_ownership(bob.get_address(), {
                as: bob,
            });
        }, item.errors.INVALID_CALLER);
    });

    it('Transfer ownership as owner should succeed', async () => {
        let owner = await item.get_owner()
  
        assert(`${owner}` === `${alice.get_address()}`);
        await item.declare_ownership(bob.get_address(), {
            as: alice,
        });
        await item.claim_ownership({
            as: bob,
        });
        owner = await item.get_owner()
        assert(`${owner}` === `${bob.get_address()}`);
    });
});


