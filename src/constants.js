export const DEFAULT_CURRENCY = "AED";

export const PROPERTY_TYPES = [
    { value: "commercial", label: "Commercial" },
    { value: "residential", label: "Residential" },
];

export const PROPERTY_CATEGORY_TYPES = [
    { value: "rent", label: "Rent" },
    { value: "sale", label: "Sale" },
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

export const OFFER_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
}

export const VIRTUAL_TOUR_TYPE = {
    VIDEO: "video",
    URL: "url",
    SLIDESHOW: "slideshow"
}

export const SNAG_LIST = [
    { value: "wall_ceiling", label: "Wall & Ceiling Painting" },
    { value: "wall_floor", label: "Wall, Floor & Skirting Tiles" },
    { value: "wallpaper", label: "Wallpaper" },
    { value: "floor_carpet", label: "Floor Carpet" },
    { value: "wooden_floor", label: "Wooden Flooring & Skirting" },
    { value: "ceiling", label: "Ceiling" },
    { value: "gypsum_false_ceiling", label: "Gypsum False Ceiling Boards & Tiles" },
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
    "manager": "Manager",
    "staff": "Staff",
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
}

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
}

export const DASHBOARD_FILTER_VALUE = {
    CUSTOM: "custom",
    TODAY: "today",
    YESTERDAY: "yesterday",
    THIS_MONTH: "this_month",
    PAST_MONTH: "past_month",
    PAST_3_MONTH: "past_3_months"
};

export const DASHBOARD_FILTER_LABEL = {
    "custom": "Custom",
    "today": "Today",
    "yesterday": "Yesterday",
    "this_month": "This Month",
    "past_month": "Past Month",
    "past_3_months": "Past 3 Months"
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