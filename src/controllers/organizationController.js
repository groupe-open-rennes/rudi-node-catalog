const mod = 'orgCtrl'
/*
 * This file describes the steps followed for each
 * action on the organizations (producer or publisher)
 */

// -------------------------------------------------------------------------------------------------
// External dependencies
// -------------------------------------------------------------------------------------------------
import { beautify } from '../utils/jsUtils.js'
import { logT } from '../utils/logging.js'

// -------------------------------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// Data models
// -------------------------------------------------------------------------------------------------
import { getOrganizationWithJson } from '../db/dbQueries.js'
import { Organization } from '../definitions/models/Organization.js'
import { RudiError } from '../utils/errors.js'
// import cache from '../db/dbCache'

// -------------------------------------------------------------------------------------------------
// Functions
// -------------------------------------------------------------------------------------------------
export const newOrganization = async (orgJson) => {
  const fun = 'newOrganization'
  logT(mod, fun, beautify(orgJson))
  try {
    const org = await getOrganizationWithJson(orgJson)
    if (!!org) return org

    const dbOrganization = new Organization(orgJson)
    await dbOrganization.save()
    return dbOrganization
  } catch (err) {
    throw RudiError.treatError(mod, fun, err)
  }
}
