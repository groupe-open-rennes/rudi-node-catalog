// const mod = 'keywThes'

// -------------------------------------------------------------------------------------------------
// Internal dependencies
// -------------------------------------------------------------------------------------------------
import { Thesaurus } from './Thesaurus.js'

// -------------------------------------------------------------------------------------------------
// Dynamic enum init
// -------------------------------------------------------------------------------------------------

const CODE = 'updateFrequency'

const INIT_VALUES = {
  continual: {fr: 'Continue', en:'Continual'},
  daily: {fr: 'Journalière', en:'Daily'},
  weekly: {fr: 'Hebdomadaire', en:'Weekly'},
  fortnightly: {fr: 'Toutes les deux semaines', en:'Fortnightly'},
  monthly: {fr: 'Tous les mois', en:'Monthly'},
  quarterly: {fr: 'Tous les trois mois', en:'Quarterly'},
  biannually: {fr: 'Tous les six mois', en:'Biannually'},
  annually: {fr: 'Tous les ans', en:'Annually'},
  asNeeded: {fr: 'Si besoin', en:'As needed'},
  irregular: {fr: 'Sans régularité', en:'Irregular'},
  notPlanned: {fr: 'Non planifié', en:'Not planned'},
  unknown: {fr: 'Inconnue', en:'Unknown'},
}

export const UpdateFrequency = new Thesaurus(CODE, INIT_VALUES)

export const isValid = (val) => UpdateFrequency.isValid(val)

export default UpdateFrequency
