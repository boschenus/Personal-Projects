"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDataForTesting = exports.load = exports.delete_square = exports.save = exports.listNames = exports.dummy = void 0;
var data = new Map();
/** Returns a list of all the named save files. */
var dummy = function (req, res) {
    var name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send('missing "name" parameter');
        return;
    }
    res.send({ greeting: "Hi, ".concat(name) });
};
exports.dummy = dummy;
/** Returns a list of all the named save files. */
var listNames = function (_, res) {
    var e_1, _a;
    var names = [];
    try {
        for (var _b = __values(data.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            names.push(key);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.send({ list: names });
};
exports.listNames = listNames;
/** Handles request for /save by storing the given file. */
var save = function (req, res) {
    var name = req.body.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    var value = req.body.value;
    if (value === undefined) {
        res.status(400).send('required argument "value" was missing');
        return;
    }
    data.set(name, value);
};
exports.save = save;
/** Handles request for /delete by delete the given file. */
var delete_square = function (req, res) {
    var name = req.body.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    data.delete(name);
    res.status(200);
};
exports.delete_square = delete_square;
/** Handles request for /load by returning the file requested. */
var load = function (req, res) {
    // TODO(6b): implement this function
    var name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    if (data.get(name) === undefined) {
        res.status(400).send('no previously saved with the name');
    }
    else {
        res.send({ value: data.get(name) });
    }
};
exports.load = load;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
var first = function (param) {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
/** Used in tests to set the data map back to empty. */
var resetDataForTesting = function () {
    data.clear();
};
exports.resetDataForTesting = resetDataForTesting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQVFBLElBQU0sSUFBSSxHQUF5QixJQUFJLEdBQUcsRUFBbUIsQ0FBQztBQUM5RCxrREFBa0Q7QUFDM0MsSUFBTSxLQUFLLEdBQUcsVUFBQyxHQUFnQixFQUFFLEdBQWlCO0lBQ3ZELElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ2pELE9BQU87S0FDUjtJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsY0FBTyxJQUFJLENBQUUsRUFBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDO0FBUlcsUUFBQSxLQUFLLFNBUWhCO0FBR0Ysa0RBQWtEO0FBQzNDLElBQU0sU0FBUyxHQUFHLFVBQUMsQ0FBYyxFQUFFLEdBQWlCOztJQUN6RCxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7O1FBQ3ZCLEtBQWdCLElBQUEsS0FBQSxTQUFBLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQSxnQkFBQSw0QkFBQztZQUF2QixJQUFJLEdBQUcsV0FBQTtZQUNWLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDaEI7Ozs7Ozs7OztJQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDLENBQUM7QUFOVyxRQUFBLFNBQVMsYUFNcEI7QUFFRiwyREFBMkQ7QUFDcEQsSUFBTSxJQUFJLEdBQUcsVUFBQyxHQUFnQixFQUFFLEdBQWlCO0lBQ3RELElBQU0sSUFBSSxHQUFH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