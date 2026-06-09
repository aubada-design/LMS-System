import female26 from "./assets/avatars/magnific_female-26-white-swedish-s_cDwicnS0eP.jpg";
import female27 from "./assets/avatars/magnific_female-27-black-ethiopian_fFYXE0sCDY.jpg";
import female29 from "./assets/avatars/magnific_female-29-black-nigerian-_Xt6YXiJBfo.jpg";
import female32 from "./assets/avatars/magnific_female-32-hispaniclatina-_jSIQjQ5LD0.jpg";
import female33 from "./assets/avatars/magnific_female-33-central-asian-k_3G17ZH4REY.jpg";
import female35 from "./assets/avatars/magnific_female-35-afrocaribbean-t_rloujESxtc.jpg";
import female37 from "./assets/avatars/magnific_female-37-east-african-ke_3G17ZvSREY.jpg";
import female38 from "./assets/avatars/magnific_female-38-indigenous-nava_VdO2DfGMMU.jpg";
import male28 from "./assets/avatars/magnific_male-28-middle-eastern-le_rloErHOxtc.jpg";
import male29 from "./assets/avatars/magnific_male-29-southeast-asian-v_gJv5UesSXO.jpg";
import male31 from "./assets/avatars/magnific_male-31-mixed-race-south-_1sBExi8r4r.jpg";
import male35 from "./assets/avatars/magnific_male-35-east-asian-chines_DBPAD6gpcl.jpg";
import male36 from "./assets/avatars/magnific_male-36-pacific-islander-_1sBExXlr4r.jpg";
import male39 from "./assets/avatars/magnific_male-39-white-australian-_ONQjPKaynm.jpg";
import male40 from "./assets/avatars/magnific_male-40-black-jamaican-fo_xg8QLLWjfW.jpg";
import nonbinary25 from "./assets/avatars/magnific_nonbinary-25-arab-egyptia_aQndCwYfSh.jpg";
import nonbinary27 from "./assets/avatars/magnific_nonbinary-27-south-asian-_PiHLPrL42C.jpg";
import nonbinary30 from "./assets/avatars/magnific_nonbinary-30-eastern-euro_l7hbSK0gv9.jpg";
import transMan34 from "./assets/avatars/magnific_transgender-man-34-brazil_1sBExUpr4r.jpg";
import transWoman30 from "./assets/avatars/magnific_transgender-woman-30-fili_iAkwRGd3uK.jpg";

const avatarPool = [
  female26,
  female27,
  female29,
  female32,
  female33,
  female35,
  female37,
  female38,
  male28,
  male29,
  male31,
  male35,
  male36,
  male39,
  male40,
  nonbinary25,
  nonbinary27,
  nonbinary30,
  transMan34,
  transWoman30,
];

const brokerAvatarMap = {
  "ar-1": male28,
  "ar-2": female32,
  "ar-3": male31,
  "ar-4": female38,
  "en-1": female26,
  "en-2": male39,
  "en-3": female27,
  "en-4": transMan34,
  "ru-1": female33,
  "ru-2": male40,
  "ru-3": female35,
  "ru-4": male36,
  "hi-1": nonbinary27,
  "hi-2": transWoman30,
  "hi-3": male29,
  "hi-4": female37,
  "zh-1": male35,
  "zh-2": female29,
  "zh-3": nonbinary25,
  "zh-4": nonbinary30,
};

const avatarFraming = {
  "ar-1": { scale: 1.65, position: "center 18%" },
  "ar-2": { scale: 3.2, position: "center 14%", origin: "22% 12%" },
  "ar-3": { scale: 1.45, position: "center 16%" },
  "ar-4": { scale: 1.75, position: "center 15%" },
  "en-1": { scale: 2.6, position: "center 13%", origin: "55% 12%" },
  "en-2": { scale: 1.08, position: "center 18%" },
  "en-3": { scale: 2.45, position: "center 13%", origin: "50% 12%" },
  "en-4": { scale: 1.2, position: "center 18%" },
  "ru-1": { scale: 2.35, position: "center 13%", origin: "62% 12%" },
  "ru-2": { scale: 1.2, position: "center 18%" },
  "ru-3": { scale: 1.28, position: "center 18%" },
  "ru-4": { scale: 1.35, position: "center 17%" },
  "hi-1": { scale: 1.45, position: "center 16%" },
  "hi-2": { scale: 1.28, position: "center 17%" },
  "hi-3": { scale: 1.24, position: "center 18%" },
  "hi-4": { scale: 1.5, position: "center 15%" },
  "zh-1": { scale: 1.1, position: "center 18%" },
  "zh-2": { scale: 1.28, position: "center 18%" },
  "zh-3": { scale: 1.25, position: "center 18%" },
  "zh-4": { scale: 1.08, position: "center 18%" },
};

export function getBrokerAvatar(broker, fallbackIndex = 0) {
  return brokerAvatarMap[broker.id] || avatarPool[fallbackIndex % avatarPool.length];
}

export function getBrokerAvatarStyle(broker) {
  const framing = avatarFraming[broker.id] || { scale: 1.18, position: "center 18%" };

  return {
    objectPosition: framing.position,
    transform: `scale(${framing.scale})`,
    transformOrigin: framing.origin || "center top",
  };
}
