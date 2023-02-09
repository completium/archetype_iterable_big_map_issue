import {
  get_account,
  set_mockup,
  set_mockup_now,
  set_quiet,
} from "@completium/experiment-ts"

import { good } from "./binding/good"
import { bad } from "./binding/bad"

const assert = require("assert")

/* Accounts ---------------------------------------------------------------- */

const alice = get_account("alice")

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true)

/* Endpoint ---------------------------------------------------------------- */

set_mockup()

/* Now --------------------------------------------------------------------- */

set_mockup_now(new Date(Date.now()))

/* Scenario ---------------------------------------------------------------- */

describe("[HELLO] Contract deployment", async () => {
  it("Deploy good", async () => {
    await good.deploy({ as: alice })
  })
  it("Deploy bad", async () => {
    await bad.deploy({ as: alice })
  })
})
