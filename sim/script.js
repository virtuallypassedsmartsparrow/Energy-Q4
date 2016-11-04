// Global variables
var category = "";
var page = " ";



var values = { // m for model

    x_0: 0,
    L: 0,
    r: 0,
    m: 0,
    k: 0,
    theta_deg: 0,
    theta_rad: 0,
    I_o: 0,
    h1: 0,
    x1: 0,
    w1: 0,

    h2u: 0,
    x2u: 0,
    w2u: 0,

    h2d: 0,
    x2d: 0,
    w2d: 0,
};

var valuesRounded = {
    x_0: 0,
    L: 0,
    r: 0,
    m: 0,
    k: 0,
    theta_deg: 0,
    theta_rad: 0,
    I_o: 0,
    h1: 0,
    x1: 0,
    w1: 0,

    h2u: 0,
    x2u: 0,
    w2u: 0,

    h2d: 0,
    x2d: 0,
    w2d: 0,
};

var names = { //choose how to write variable string.
    // M: "M",
    // R: "R",
    // theta_deg: "&#x03B8",
    // theta_rad: "&#x03B8",
    // m_r: "m<sub>r</sub>",
    // m_spoke: "m<sub>spoke</sub>",
    // I_r: "I<sub>r</sub>",
    // I_s: "I<sub>s</sub>",
    // I_o: "I<sub>o</sub>",
    // F: "F",
    // a_G: "a<sub>G</sub>",
    // X: "X",
    // T: "T",
    // V_G: "V<sub>G</sub>",
    x_0: "x<sub>o</sub>",
    L: "L",
    r: "r",
    m: "m",
    k: "k",
    theta_deg: "&#x03B8",
    theta_rad: "&#x03B8",
    I_o: "I<sub>o</sub>",
    h1: "h<sub>1</sub>",
    x1: "x<sub>1</sub>",
    w1: "&#969<sub>1</sub>",
    h2u: "h<sub>2</sub>",
    x2u: "x<sub>2</sub>",
    w2u: "&#969<sub>2</sub>",
    h2d: "h<sub>2</sub>",
    x2d: "x<sub>2</sub>",
    w2d: "&#969<sub>2</sub>",

};

var units = { //write the units
    x_0: "m",
    L: "m",
    r: "m",
    m: "kg",
    k: "Nm<sup>-1</sup>",
    theta_deg: "deg",
    theta_rad: "rad",
    I_o: "kgm<sup>2</sup>",
    h1: "m",
    x1: "m",
    w1: "rad/s",
    h2u: "m",
    x2u: "m",
    w2u: "rad/s",
    h2d: "m",
    x2d: "m",
    w2d: "rad/s",
};


// Get values from SS
var model = new pipit.CapiAdapter.CapiModel({
    x_0: 0,
    L: 0,
    r: 0,
    m: 0,
    k: 0,
    theta_deg: 0,
    theta_rad: 0,
    I_o: 0,
    h1: 0,
    x1: 0,
    w1: 0,

    h2u: 0,
    x2u: 0,
    w2u: 0,

    h2d: 0,
    x2d: 0,
    w2d: 0,

    page: "10",

});
// I think this exposes the values to Smart Sparrow. :D
pipit.CapiAdapter.expose('x_0', model);
pipit.CapiAdapter.expose('L', model);
pipit.CapiAdapter.expose('r', model);
pipit.CapiAdapter.expose('m', model);
pipit.CapiAdapter.expose('k', model);
pipit.CapiAdapter.expose('theta_deg', model);
pipit.CapiAdapter.expose('theta_rad', model);
pipit.CapiAdapter.expose('I_o', model);
pipit.CapiAdapter.expose('h1', model);
pipit.CapiAdapter.expose('x1', model);
pipit.CapiAdapter.expose('w1', model);
pipit.CapiAdapter.expose('h2u', model);
pipit.CapiAdapter.expose('x2u', model);
pipit.CapiAdapter.expose('w2u', model);
pipit.CapiAdapter.expose('h2d', model);
pipit.CapiAdapter.expose('x2d', model);
pipit.CapiAdapter.expose('w2d', model);

pipit.CapiAdapter.expose('page',model);

//this gets the values from Smart Sparrow. So does that mean I need to put inputs into Smart Sparrow variable tab? Either way, I'm sure these are just the inputs
//I think I can place M R theta_deg in variables. Then make pages # in iniitial state. Then i'm done??!
pipit.Controller.notifyOnReady();

model.on("change:x_0", function() {
    draw();
});
model.on("change:L", function() {
    draw();
});
model.on("change:r", function() {
    draw();
});
model.on("change:m", function() {
    draw();
});
model.on("change:k", function() {
    draw();
});
model.on("change:theta_deg", function() {
    draw();
});
model.on("change:page", function() {
    draw();
});

// This is JQuery right? 
$("#selectBox").change(function() {
    draw();
});

//this is the generic function which does all the magic. It gets the values from SS then calculates them then figures out which catagory its in (how does it know what question #? from getvaleusformSS function!!) then displays the values
function draw() {
    getValuesFromSS();
    calculateVariables();

    category = $("#selectBox option:selected").val();
    sendValuesToSS();
    displayValues();
}

//there is no need to send the input values back to smart sparrow. so only send the values that have been calculated.
function sendValuesToSS() {
    model.set("theta_rad", values.theta_rad);
    model.set("I_o", values.I_o);
    model.set("h1", values.h1);
    model.set("x1", values.x1);
    model.set("w1", values.w1);
    model.set("h2u", values.h2u);
    model.set("x2u", values.x2u);
    model.set("w2u", values.w2u);
    model.set("h2d", values.h2d);
    model.set("x2d", values.x2d);
    model.set("w2d", values.w2d);

}
// what is the purpose of the num == 4 ? Is this to make it fit to the table somehow?
function displayValues() {
    var show = getShowVariables();
    var s = "<table class=right><tr><td>";
    var num = 1;

    $.each(show, function(i, e) {
        var name = names[e]; // objects can reference members by object.property or by object['property'], allowing you to use variables
        var value = valuesRounded[e];
        var unit = units[e];

        s += name + " = " + value + " " + unit + "<br>";

        if (num == 4) {
            s += "</td><td>";
            num = 0
        }
        num++;

    });

    s += "</td></tr></table>";

    $("#right")[0].innerHTML = s;
}

// Here i'm getting all the inputs from Smart Sparrow. This is the start of the draw function. Only put in inputs because other variables won't be there

//really not sure if i've got this right... :(

function getValuesFromSS() {
//randbetween(x1,x2,inc). Math.floor(Math.random() * (x2-x1+1)/inc + x1/inc)*inc



    // values.M = Math.floor(Math.random()* 4 + 1)*1; //1<= M <= 4 (incriment 1)
    // values.R = Math.floor(Math.random() * 8 + 5)*0.1; //0.5 <= R <= 1.2 (incriment 0.1)
    // page = model.get('page');
    // values.theta_deg = model.get(theta_deg); //20 <= theta_deg <= 45 (incriment 5)
    // values.X = Math.floor(Math.random() * 5 + 2)*1;
                                values.x_0 = model.get('x_0');
                                values.L = model.get('L');
                                page = model.get('page');
                                values.r = model.get('r');
                                values.m = model.get('m');
                                values.k = model.get('k');
                                values.theta_deg = model.get('theta_deg');
                                values.m = model.get('m');
                            }
//ones the inputs are pulled from Smart Sparrow then they're calculated (all part of the draw function). Make sure I start from elementary formulas and work done.
function calculateVariables() {

    values.theta_rad = values.theta_deg * Math.PI / 180;

    values.I_o = (1/3) * values.m * values.r * values.r;
    values.h1 = 0.5 * values.r * Math.cos(values.theta_rad);
    values.x1 = Math.sqrt(values.L * values.L + values.r * values.r - 2 * values.L * values.r * Math.cos(values.theta_rad)) - values.x_0;
    values.w1 = 0;

    values.h2u = values.r / 2;
    values.x2u = values.L - values.r - values.x_0;
    values.w2u = Math.sqrt(2/values.I_o) * Math.sqrt(values.m * 9.81 * (values.h1 - values.h2u) + 0.5 * values.k * (values.x1 * values.x1 - values.x2u * values.x2u));

    values.h2d = - values.r / 2;
    values.x2d = values.L + values.r - values.x_0;
    values.w2d = Math.sqrt(2/values.I_o) * Math.sqrt(values.m * 9.81 * (values.h1 - values.h2d) + 0.5 * values.k * (values.x1 * values.x1 - values.x2d * values.x2d));


    // Round values into valuesRounded
    $.each(values, function(i, e) {
        valuesRounded[i] = round(values[i]);
    })
}
// case 1 = catagory 1. Is the order determiend by the order in the HTML code?
// page 3 = 30. Page 3 from start of SS tutorial? Start at page 0 or page 1? Why is crank shaft velocity page 1??!
// For case 1, pages 3,4,5,6,7,8 and 9 are all taken care of by the one return line. right?
// what is the max number of variables per category??
// what happens if I have less than 5 categories? How do I specify 3 categories for example?
function getShowVariables() {
    switch (category) {
        case "1": // Category 1
            switch (page) {
                case "10": 
                    return ["L", "r", "theta_deg", "m"];
                    break;
                case "20":
                    return ["L", "r", "theta_deg", "m", "I_o"];
                    break; 
                case "30":
                case "40": 
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                case "100":
                    return ["L", "r", "theta_deg", "m", "I_o", "x_0", "k"];
                    break;
            }
            break;

        case "2": // Category 2
            switch (page) {
                case "10":
                case "20":
                    return [];
                    break;
                case "30":
                    return ["h1"];
                    break;
                case "40":
                case "50":
                case "60":
                    return ["h1", "x1"];
                    break;
                case "70":
                    return ["h1", "x1", "w1"];
                    break;
                case "80":
                case "90":
                    return ["h1", "x1"];
                    break;
                case "100":
                    return ["h1", "x1", "w1"];
                    break;
            }
            break;

        case "3":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                    return ["h2u"];
                    break;
                case "70":
                    return ["h2u", "x2u"];
                    break;
                case "80":
                    return [];
                    break;
                case "90":
                    return ["h2d"];
                    break;
                case "100":
                    return ["h2d", "x2d"];
                    break;
            }
            break;

        // case "4":
        //     switch (page) {
        //         case "10":
        //         case "20":
        //         case "30":
        //         case "40":
        //         case "50":
        //         case "60":
        //             return [];
        //             break;
        //         case "70":
        //             return ["a_G"];
        //             break;
        //         case "80":
        //             return ["a_G", "T"];
        //             break;
        //     }
        //     break;
    }
    return []; // empty
}
/*
function getShowVariables() {
    switch (category) {
        case "1": // Category 1
            switch (page) {
                case "10": //Crank Shaft Angular Velocity page
                case "20": //Input Power page
                    return ["tMax", "tMin", "tAvg"];
                    break;

                case "30": //Theta_1 and theta_2 page
                case "40": // and so on
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["tMax", "tMin", "tAvg", "P"];
                    break;
            }
            break;

        case "2": // Category 2
            switch (page) {
                case "10":
                    return [];
                    break;

                case "20":
                case "30":
                    return ["w_1_rad"];
                    break;

                case "40":
                    return ["w_1_rad", "theta_1", "theta_2"];
                    break;

                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["w_1_rad", "theta_1", "theta_2", "delta_E"];
                    break;
            }
            break;

        case "3":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["d_1", "d_2"];
                    break;
            }
            break;

        case "4":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["w_2_RPM"];
                    break;
            }
            break;

        case "5":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                    return [];
                    break;

                case "50":
                    return ["w_1_RPM", "wMin", "wMax"];
                    break;

                case "60":
                    return ["w_1_RPM", "wMin", "wMax", "C"];
                    break;

                case "70":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "i_reqd"];
                    break;

                case "80":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "rho", "i_reqd", "i_fw"];
                    break;

                case "90":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "rho", "i_reqd", "i_fw", "dI", "dO"];
                    break;
            }
            break;

    }
    return []; // empty
}
*/



// Debugging
// $.each(model.attributes, function(i, e) {
//     console.log(i + " : " + e);
// });


function round(input) {
    // if it is an integer number, return it
    if (parseInt(input) == parseFloat(input)) {
        return input;
    }

    // if the input is NaN or not available or 0, dont round
    if (isNaN(input) == true || input == " " || input == 0) {
        return input;
    }

    if (input > 0) {
        var position = 0;
        var i = input;
        while (i < 1000) { // show 3 sig figs
            i *= 10;
            position++;
        }
        input = Math.round(i) / Math.pow(10, position);
        return input;
    }
    
    return input;
}
