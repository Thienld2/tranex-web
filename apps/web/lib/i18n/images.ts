/** Build an Unsplash URL; next/image resizes it further per device. */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

/** Images shared by every locale. Replace with the company's own photos. */
export const img = {
  heroCity: unsplash("photo-1477959858617-67f85cf4f1df", 2400),
  heroTowers: unsplash("photo-1511818966892-d7d671e672a2", 2400),
  heroFacade: unsplash("photo-1460574283810-2aab119d8511", 2400),
  consulting: unsplash("photo-1517048676732-d65bc937f952", 2000),
  crane: unsplash("photo-1429497419816-9ca5cfb4571a", 2400),

  serviceDesign: unsplash("photo-1580587771525-78b9dba3b914", 900),
  serviceBim: unsplash("photo-1503387762-592deb58ef4e", 900),
  servicePrecast: unsplash("photo-1541888946425-d81bb19240f5", 900),
  serviceMaterials: unsplash("photo-1504307651254-35680f356dfd", 900),
  serviceMachines: unsplash("photo-1517089596392-fb9a9033e05b", 900),

  typeTownhouse: unsplash("photo-1600585154340-be6161a56a0c", 700),
  typeVilla: unsplash("photo-1613490493576-7fde63acd811", 700),
  typeHotel: unsplash("photo-1551882547-ff40c63fe5fa", 700),
  typeApartment: unsplash("photo-1460317442991-0ec209397118", 700),
  typeFactory: unsplash("photo-1586528116311-ad8dd3c8310d", 700),
  typeElderly: unsplash("photo-1576765608535-5f04d1e3f289", 700),
  typeSchool: unsplash("photo-1503676260728-1c00da094a0b", 700),
  typeHospital: unsplash("photo-1538108149393-fbbd81895907", 700),

  navSolutions: unsplash("photo-1517048676732-d65bc937f952", 500),
  navTypes: unsplash("photo-1600585154340-be6161a56a0c", 500),
  navChallenge: unsplash("photo-1522071820081-009f0129c71c", 500),
  navCompany: unsplash("photo-1486406146926-c627a92ad1ab", 500),

  eventApartment: unsplash("photo-1545324418-cc1a3fa10c00", 700),
  eventExpo: unsplash("photo-1582268611958-ebfd161ef9cf", 700),
  notice: unsplash("photo-1582268611958-ebfd161ef9cf", 400),

  storyBim: unsplash("photo-1522071820081-009f0129c71c", 1200),
  storyFactory: unsplash("photo-1553413077-190dd305871c", 700),
  storySpirit: unsplash("photo-1556761175-b413da4baf72", 700),
  storyOffice: unsplash("photo-1487958449943-2429e8be8625", 1000),
  storyResort: unsplash("photo-1566073771259-6a8506099945", 700),
  storyPointCloud: unsplash("photo-1581094794329-c8112a89af12", 700),
  storyVilla: unsplash("photo-1564013799919-ab600027ffc6", 1000),

  aboutCompany: unsplash("photo-1486406146926-c627a92ad1ab", 900),
  aboutHistory: unsplash("photo-1508450859948-4e04fabaa4ea", 900),

  pickupVideo: unsplash("photo-1477959858617-67f85cf4f1df", 900),
  pickupRecruit: unsplash("photo-1621905251189-08b45d6a269e", 900),
  pickupProfile: unsplash("photo-1460574283810-2aab119d8511", 900),

  brochureProfile: unsplash("photo-1600585154340-be6161a56a0c", 500),
  brochureProjects: unsplash("photo-1460574283810-2aab119d8511", 500),
}
