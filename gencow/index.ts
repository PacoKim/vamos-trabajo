/**
 * gencow/index.ts — Entry point
 *
 * Gencow runtime loads this file and registers procedures and createCrud via defineApi.
 */
import "./runtime";

import { defineApi } from "@gencow/core";
import {
  list as itemsList,
  get as itemsGet,
  create as itemsCreate,
  update as itemsUpdate,
  remove as itemsRemove,
} from "./items";

export default defineApi({
  procedures: {
    itemsList,
    itemsGet,
    itemsCreate,
    itemsUpdate,
    itemsRemove,
  },
});
