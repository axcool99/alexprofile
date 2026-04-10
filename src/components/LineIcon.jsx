import { Icon } from '@iconify/react'

import accountSmall from '@iconify-icons/line-md/account-small'
import arrowsHorizontalAlt from '@iconify-icons/line-md/arrows-horizontal-alt'
import arrowDownCircleTwotone from '@iconify-icons/line-md/arrow-down-circle-twotone'
import briefcaseTwotone from '@iconify-icons/line-md/briefcase-twotone'
import calendar from '@iconify-icons/line-md/calendar'
import clipboardTwotone from '@iconify-icons/line-md/clipboard-twotone'
import coffeeTwotone from '@iconify-icons/line-md/coffee-twotone'
import confirmCircleTwotone from '@iconify-icons/line-md/confirm-circle-twotone'
import documentListTwotone from '@iconify-icons/line-md/document-list-twotone'
import documentReport from '@iconify-icons/line-md/document-report'
import grid3 from '@iconify-icons/line-md/grid-3'
import heartTwotone from '@iconify-icons/line-md/heart-twotone'
import heartHalfTwotone from '@iconify-icons/line-md/heart-half-twotone'
import homeMdTwotoneAlt from '@iconify-icons/line-md/home-md-twotone-alt'
import laptopTwotone from '@iconify-icons/line-md/laptop-twotone'
import lightbulbTwotone from '@iconify-icons/line-md/lightbulb-twotone'
import mapMarkerMultipleAltTwotone from '@iconify-icons/line-md/map-marker-multiple-alt-twotone'
import mapMarkerTwotone from '@iconify-icons/line-md/map-marker-twotone'
import medicalServices from '@iconify-icons/line-md/medical-services'
import paintDropHalfTwotone from '@iconify-icons/line-md/paint-drop-half-twotone'
import questionCircleTwotone from '@iconify-icons/line-md/question-circle-twotone'
import starTwotone from '@iconify-icons/line-md/star-twotone'
import textBoxTwotone from '@iconify-icons/line-md/text-box-twotone'

const ICON_MAP = {
  SK: mapMarkerTwotone,
  '38': calendar,
  MR: heartTwotone,
  K7: accountSmall,
  JX: briefcaseTwotone,
  BL: heartHalfTwotone,
  FL: arrowsHorizontalAlt,
  PX: starTwotone,
  SIG: lightbulbTwotone,
  DEV: laptopTwotone,
  PMS: clipboardTwotone,
  WEB: grid3,
  BR: paintDropHalfTwotone,
  PR: homeMdTwotoneAlt,
  FIN: documentReport,
  MOB: laptopTwotone,
  DOWN: arrowDownCircleTwotone,
  QN: questionCircleTwotone,
  EDU: textBoxTwotone,
  HW: medicalServices,
  FNB: coffeeTwotone,
  LEG: documentListTwotone,
  TR: mapMarkerMultipleAltTwotone,
}

export default function LineIcon({ name, className = '', ...props }) {
  if (name === 'BL') {
    return (
      <svg viewBox="-8 0 512 512" className={className} aria-hidden="true" {...props}>
        <path
          d="M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm0 376c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0-128c-53.02 0-96 42.98-96 96s42.98 96 96 96c-106.04 0-192-85.96-192-192S141.96 64 248 64c53.02 0 96 42.98 96 96s-42.98 96-96 96zm0-128c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z"
          fill="currentColor"
        />
      </svg>
    )
  }
  if (name === 'FL') {
    return (
      <svg viewBox="0 -2 20 20" className={className} aria-hidden="true" {...props}>
        <g transform="translate(-2 -4) rotate(180 12 12)" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M21,11c-2.25,0-2.25,2-4.5,2s-2.25-2-4.5-2-2.25,2-4.5,2S5.25,11,3,11" />
          <path d="M3,5C5.25,5,5.25,7,7.5,7S9.75,5,12,5s2.26,2,4.51,2S18.75,5,21,5" />
          <path d="M21,17c-2.25,0-2.25,2-4.5,2s-2.25-2-4.5-2-2.25,2-4.5,2S5.25,17,3,17" />
        </g>
      </svg>
    )
  }
  if (name === 'MOB') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props} fill="none">
        <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        <line x1="11" y1="18" x2="13" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'DOWN') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...props} fill="none">
        <polyline points="23.5 22.5 1.5 22.5 1.5 17.55 1.5 0.5" stroke="currentColor" strokeWidth="1.9" strokeMiterlimit="10" />
        <polyline points="22.54 16.76 12.98 7.2 9.15 11.02 1.5 3.37" stroke="currentColor" strokeWidth="1.9" strokeMiterlimit="10" />
        <polyline points="17.76 16.76 22.54 16.76 22.54 11.98" stroke="currentColor" strokeWidth="1.9" strokeMiterlimit="10" />
      </svg>
    )
  }
  const icon = ICON_MAP[name]
  if (!icon) {
    return <span className={className} {...props}>{name}</span>
  }

  return <Icon icon={icon} className={className} {...props} />
}
