const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Medicine Name is required."],
            unique: [true, "Medicine Name should be unique."]
        },
        productionDate: {
            type: String,
            required: [true, "Production Date Should be Included"],
            unique: [true, "Each Medicine should only have a unique value of Production Date ... It Shouldn't be duplicated."],
        },
        expiryDate: {
            type: String,
            required: [true, "Expiration Date Should be Included."],
            unique: [true, "Each Medicine should only have a unique value  for the Expiration Date ... It Shouldn't be duplicated."],
        },
        medicineLeaflet: {
            type: String,
            required: [true, "Medicine Leaflet && Dosage Should be Included."],
        },
        medicinePrice: {
            type: Number,
            required: [true, "Medicine Price Should be Included."],
        },
        medicineQuantity: {
            type: Number,
            required: [true, "Medicine Quantity Should be Included."],
        }
    })

mongoose.model("medicine", schema);
