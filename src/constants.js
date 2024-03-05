export const DEFAULT_CURRENCY = "AED";

export const PRODUCT_CATEGORIES = [{ value: 1, label: "Property" }];

export const PROPERTY_TYPES = [
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Residential" },
];

export const PROPERTY_CATEGORY_TYPES = [
  { value: "rent", label: "Rent" },
  { value: "sale", label: "Sale" },
];

export const PARKING = [
  { value: "no", label: "No" },
  { value: "garage", label: "Garage" },
  { value: "parking_spaces", label: "Parking Spaces" },
];

export const RESIDENTIAL_PROPERTY = [
  { value: "apartment", label: "Apartments" },
  { value: "house", label: "House" },
  { value: "bungalow", label: "Bungalow" },
  { value: "studio", label: "Studio" },
  { value: "room", label: "Room" },
  { value: "duplex", label: "Duplex" },
  { value: "triplex", label: "Triplex" },
  { value: "cottage", label: "Cottage" },
];

export const COMMERCIAL_PROPERTY = [
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "shopping_center", label: "Shopping Center" },
  { value: "shop", label: "Shop" },
  { value: "store", label: "Store" },
  { value: "hotels", label: "Hotel" },
  { value: "club", label: "Club" },
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel_room", label: "Hotel Room" },
];

export const PRICE_TYPE = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const UNITS = [
  { value: "sq_ft", label: "Square Ft" },
  { value: "sq_mt", label: "Square Mt" },
];

export const BEDROOMS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
];

export const LAYOUT_OPTIONS = [
  { value: "Open Plan", label: "Open Plan" },
  { value: "Private Offices", label: "Private Offices" },
  { value: "Mixed", label: "Mixed" },
];

export const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const KITCHEN_OPTIONS = [
  { value: "Full Kitchen", label: "Full Kitchen" },
  { value: "Kitchenette", label: "Kitchenette" },
  { value: "No Kitchen", label: "No Kitchen" },
];

export const DISPLAY_WINDOW_OPTIONS = [
  { value: "Full Height", label: "Full Height" },
  { value: "Storefront", label: "Storefront" },
  { value: "Corner", label: "Corner" },
  { value: "Other", label: "Other" },
];

export const POOL_TYPE_OPTIONS = [
  { value: "Indoor", label: "Indoor" },
  { value: "Outdoor", label: "Outdoor" },
];

export const ROOM_TYPE_OPTIONS = [
  { value: "Single Room", label: "Single Room" },
  { value: "Studio", label: "Studio" },
  { value: "Deluxe Room", label: "Deluxe Room" },
  { value: "Double Room", label: "Double Room" },
  { value: "Queen Room", label: "Queen Room" },
  { value: "Suite", label: "Suite" },
  { value: "Connecting Room", label: "Connecting Room" },
  { value: "Penthouse Suite", label: "Penthouse Suite" },
];

export const VIEW_OPTIONS = [
  { value: "City View", label: "City View" },
  { value: "Ocean View", label: "Ocean View" },
  { value: "Garden View", label: "Garden View" },
  { value: "Pool View", label: "Pool View" },
  { value: "Mountain View", label: "Mountain View" },
];

export const SECURITY_FEATURES_OPTIONS = [
  { value: "Alarms", label: "Alarms" },
  { value: "Cameras", label: "Cameras" },
  { value: "Both", label: "Both" },
];

export const CONDITION_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Needs Renovation", label: "Needs Renovation" },
];

export const BUILDING_AMENITIES_OPTIONS = [
  { value: "Pool", label: "Pool" },
  { value: "Gym", label: "Gym" },
  { value: "Laundry Facility", label: "Laundry Facility" },
];

export const FIREPLACE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const FIREPLACE_VALUE_OPTIONS = [
  { value: "Wood Burning", label: "Wood Burning" },
  { value: "Gas", label: "Gas" },
];

export const PARKING_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const PARKING_OPTION_TYPES = [
  { value: "Garage/Carport", label: "Garage/Carport" },
  { value: "Street Parking", label: "Street Parking" },
];

export const OUTDOOR_SPACES_OPTIONS = [
  { value: "Garden", label: "Garden" },
  { value: "Balcony", label: "Balcony" },
  { value: "Outdoor Area", label: "Outdoor Area" },
  { value: "Swimming Pool", label: "Swimming Pool" },
  { value: "Patio", label: "Patio" },
];

export const FURNISHED_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Partially Furnished", label: "Partially Furnished" },
];

export const OFFER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export const VIRTUAL_TOUR_TYPE = {
  VIDEO: "video",
  URL: "url",
  SLIDESHOW: "slideshow",
};

export const SNAG_LIST = [
  { value: "wall_ceiling", label: "Wall & Ceiling Painting" },
  { value: "wall_floor", label: "Wall, Floor & Skirting Tiles" },
  { value: "wallpaper", label: "Wallpaper" },
  { value: "floor_carpet", label: "Floor Carpet" },
  { value: "wooden_floor", label: "Wooden Flooring & Skirting" },
  { value: "ceiling", label: "Ceiling" },
  {
    value: "gypsum_false_ceiling",
    label: "Gypsum False Ceiling Boards & Tiles",
  },
  { value: "doors", label: "Doors" },
  { value: "sliding_doors", label: "Sliding Doors & Windows" },
  { value: "ironmongeries", label: "Ironmongeries" },
];

export const JOB_TITLE = [
  { value: "developer", label: "Developer" },
  { value: "real_estate_agent", label: "Real Estate Agent" },
  { value: "freelance_agent", label: "Freelance Agent" },
  { value: "landlord", label: "Landlord" },
];

export const DEFAULT_LICENSE_NO_TEXT = "Company Registration # *";
export const DEFAULT_DEED_TITLE_TEXT = "Deed Title *";

export const UPLOAD_DOCUMENT_DEFAULT = "Upload Trade Licence Document *";
export const UPLOAD_DOCUMENT_LANDLORD = "Upload Emirate ID/Copy of Passport *";

export const AGENT_TYPE = {
  AGENT: "agent",
  MANAGER: "manager",
  STAFF: "staff",
};

export const AGENT_TYPE_LABEL = {
  manager: "Manager",
  staff: "Staff",
};

export const AGENT_TYPES = [
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
];

export const USER_ALERT_MODE = {
  WISHLIST: "wishlist",
  INTEREST: "interest",
  OFFER: "offer",
  APPOINTMENT: "appointment",
  SNAGLIST: "snag_list",
};

export const USER_ALERT_TYPE = {
  WISHLIST_ADDED: 1,
  WISHLIST_REMOVED: 2,
  INTERESTED: 1,
  NOT_INTERESTED: 2,
  OFFER: 1,
  OFFER_DELETED: 2,
  APPOINTMENT: 1,
  SNAGLIST_UPDATED: 1,
  SNAGLIST_APPROVED: 2,
};

export const DASHBOARD_FILTER_VALUE = {
  CUSTOM: "custom",
  TODAY: "today",
  YESTERDAY: "yesterday",
  THIS_MONTH: "this_month",
  PAST_MONTH: "past_month",
  PAST_3_MONTH: "past_3_months",
};

export const DASHBOARD_FILTER_LABEL = {
  custom: "Custom",
  today: "Today",
  yesterday: "Yesterday",
  this_month: "This Month",
  past_month: "Past Month",
  past_3_months: "Past 3 Months",
};

export const USER_TYPE = {
  ADMIN: "admin",
  AGENT: "agent",
  CUSTOMER: "customer",
};

export const PRODUCT_LOG_TYPE = {
  WISHLIST_ADDED: "wishlist_added",
  WISHLIST_REMOVED: "wishlist_removed",
  INTERESTED: "interested",
  NOT_INTERESTED: "not_interested",
  OFFER: "offer_made",
  OFFER_REJECTED: "offer_rejected",
  OFFER_APPROVED: "offer_approved",
  APPOINTMENT_CREATED: "appointment_created",
  APPOINTMENT_COMPLETED: "appointment_completed",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  SNAGLIST_UPDATED: "snaglist_added",
  SNAGLIST_APPROVED: "snaglist_approved",
  VIEWED: "viewed",
};

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  INPROGRESS: "inprogress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const CMS_PAGE_TYPE = {
  NEWS: "news",
  BLOGS: "blogs",
};

export const AGENT_USER_ACCESS_TYPE_VALUE = {
  ADD_PROPERTY: "add_property",
  EDIT_PROPERTY: "edit_property",
  DELETE_PROPERTY: "delete_property",
};

export const AGENT_USER_ACCESS_TYPE = [
  { value: "add_property", label: "Add Property" },
  { value: "edit_property", label: "Edit Property" },
  { value: "delete_property", label: "Delete Property" },
];
