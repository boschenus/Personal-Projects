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
exports.advanceTimeForTesting = exports.resetForTesting = exports.delete_poll = exports.listPolls = exports.votePoll = exports.addPoll = exports.getPoll = exports.dummy = void 0;
// Map from name to poll details.
var polls = new Map();
// TODO: remove the dummy route
/**
 * Create a new poll with the given list of options and closing in the given
 * number of minutes. Returns a unique ID for the poll.
 * @param req The request object
 * @param res The response object
 */
var dummy = function (req, res) {
    var name = req.query.name;
    if (typeof name !== 'string' || name.length === 0) {
        res.status(400).send('missing or invalid "name" parameter');
        return;
    }
    res.send({ msg: "Hi, ".concat(name, "!") });
};
exports.dummy = dummy;
/**
 * Retrieves the current state of a given auction.
 * @param req the request
 * @param req the response
 */
var getPoll = function (req, res) {
    var name = req.body.name;
    if (typeof name !== "string") {
        res.status(400).send("missing or invalid 'name' parameter");
        return;
    }
    var poll = polls.get(name);
    if (poll === undefined) {
        res.status(400).send("no poll with name '".concat(name, "'"));
        return;
    }
    res.send({ poll: poll });
};
exports.getPoll = getPoll;
/**
 * Add the item to the list.
 * @param req the request
 * @param res the response
 */
var addPoll = function (req, res) {
    var e_1, _a;
    var name = req.body.name;
    if (typeof name !== "string") {
        res.status(400).send("missing or invalid 'name' parameter");
        return;
    }
    var minutes = req.body.minutes;
    if (typeof minutes !== "number") {
        res.status(400).send("'minutes' is not a number: ".concat(minutes));
        return;
    }
    else if (isNaN(minutes) || minutes < 1 || Math.round(minutes) !== minutes) {
        res.status(400).send("'minutes' is not a positive integer: ".concat(minutes));
        return;
    }
    var options = req.body.options;
    if (!Array.isArray(options)) {
        res.status(400).send("missing or invalid 'options' parameter");
        return;
    }
    else {
        try {
            for (var options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
                var option = options_1_1.value;
                if (typeof option !== "string") {
                    res.status(400).send("missing or invalid 'options' parameter");
                    return;
                    ;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    if (polls.has(name)) {
        res.status(400).send("poll for '".concat(name, "' already exists"));
        return;
    }
    var poll = { name: name,
        votes: [],
        endTime: Date.now() + minutes * 60 * 1000,
        options: options,
        results: []
    };
    polls.set(name, poll);
    res.send({ poll: poll });
};
exports.addPoll = addPoll;
// Help renew the last option from the same voter
var subVote = function (oldVote, voter, option) {
    var e_2, _a;
    var newVote = [];
    var replaced = false;
    try {
        for (var oldVote_1 = __values(oldVote), oldVote_1_1 = oldVote_1.next(); !oldVote_1_1.done; oldVote_1_1 = oldVote_1.next()) {
            var vote = oldVote_1_1.value;
            if (vote.voter === voter) {
                var vo = { voter: voter, option: option };
                newVote.push(vo);
                replaced = true;
            }
            else {
                newVote.push(vote);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (oldVote_1_1 && !oldVote_1_1.done && (_a = oldVote_1.return)) _a.call(oldVote_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (!replaced) {
        var vo = { voter: voter, option: option };
        newVote.push(vo);
    }
    return newVote;
};
// Help to compute the result of votes
var computeResult = function (votes, options) {
    var e_3, _a, e_4, _b;
    var results = [];
    var total = votes.length;
    try {
        for (var options_2 = __values(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
            var option = options_2_1.value;
            var i = 0;
            try {
                for (var votes_1 = (e_4 = void 0, __values(votes)), votes_1_1 = votes_1.next(); !votes_1_1.done; votes_1_1 = votes_1.next()) {
                    var vote = votes_1_1.value;
                    if (vote.option === option) {
                        i += 1;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (votes_1_1 && !votes_1_1.done && (_b = votes_1.return)) _b.call(votes_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
            results.push("".concat(((i / total) * 10000) / 100.00 + '%', " -- ").concat(option));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (options_2_1 && !options_2_1.done && (_a = options_2.return)) _a.call(options_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return results;
};
/**
 * Bids in an auction, increasing the maximum bid if the bid is higher.
 * @param req the request
 * @param req the response
 */
var votePoll = function (req, res) {
    var name = req.body.name;
    if (typeof name !== "string") {
        res.status(400).send("missing or invalid 'name' parameter");
        return;
    }
    var option = req.body.option;
    if (typeof option !== "string") {
        res.status(400).send("missing or invalid 'option' parameter ");
        return;
    }
    var voter = req.body.voter;
    if (typeof voter !== "string") {
        res.status(400).send("missing or invalid 'voter' parameter ");
        return;
    }
    var oldPoll = polls.get(name);
    if (oldPoll === undefined) {
        res.status(400).send(" Impossible! data was lost! ");
        return;
    }
    else {
        if (oldPoll.endTime <= Date.now()) {
            res.status(400).send(" this poll is over! ");
            return;
        }
        else {
            var votes = subVote(oldPoll.votes, voter, option);
            var results = computeResult(votes, oldPoll.options);
            var poll = { name: name,
                votes: votes,
                endTime: oldPoll.endTime,
                options: oldPoll.options,
                results: results
            };
            polls.set(name, poll);
            res.send({ poll: poll });
        }
    }
};
exports.votePoll = votePoll;
// Sort auctions with the ones finishing soonest first, but with all those that
// are completed after those that are not and in reverse order by end time.
var comparePools = function (a, b) {
    var now = Date.now();
    var endA = now <= a.endTime ? a.endTime : 1e15 - a.endTime;
    var endB = now <= b.endTime ? b.endTime : 1e15 - b.endTime;
    return endA - endB;
};
/**
 * Returns two list of ongoing and completed polls, each poll is listed with the amount of time remaining or the amount of time that has passed since
 * it has completed. The ongoing polls should be listed in order of increasing time remaining and the completed
 * polls should be listed in order of increasing time since completed
 * @param _req the request
 * @param res the response
 */
var listPolls = function (_req, res) {
    var e_5, _a;
    var vals = Array.from(polls.values());
    var openPolls = [];
    var closedPolls = [];
    try {
        for (var vals_1 = __values(vals), vals_1_1 = vals_1.next(); !vals_1_1.done; vals_1_1 = vals_1.next()) {
            var val = vals_1_1.value;
            if (val.endTime <= Date.now()) {
                closedPolls.push(val);
            }
            else {
                openPolls.push(val);
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (vals_1_1 && !vals_1_1.done && (_a = vals_1.return)) _a.call(vals_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    openPolls.sort(comparePools);
    closedPolls.sort(comparePools);
    res.send({ openPolls: openPolls, closedPolls: closedPolls });
};
exports.listPolls = listPolls;
/** Handles request for /delete by delete the given file. */
var delete_poll = function (req, res) {
    var name = req.body.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing or invaild');
        return;
    }
    polls.delete(name);
    res.send({ delete: true });
};
exports.delete_poll = delete_poll;
/** Testing function to remove all the added auctions. */
var resetForTesting = function () {
    polls.clear();
};
exports.resetForTesting = resetForTesting;
/** Testing function to move all end times forward the given amount (of ms). */
var advanceTimeForTesting = function (ms) {
    var e_6, _a;
    try {
        for (var _b = __values(polls.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var poll = _c.value;
            poll.endTime -= ms;
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_6) throw e_6.error; }
    }
};
exports.advanceTimeForTesting = advanceTimeForTesting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQWlCQSxpQ0FBaUM7QUFDakMsSUFBTSxLQUFLLEdBQXNCLElBQUksR0FBRyxFQUFFLENBQUM7QUFFM0MsK0JBQStCO0FBRS9COzs7OztHQUtHO0FBQ0ksSUFBTSxLQUFLLEdBQUcsVUFBQyxHQUFnQixFQUFFLEdBQWlCO0lBQ3ZELElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzVCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ2pELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDNUQsT0FBTztLQUNSO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxjQUFPLElBQUksTUFBRyxFQUFDLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFSVyxRQUFBLEtBQUssU0FRaEI7QUFFRjs7OztHQUlHO0FBQ0ksSUFBTSxPQUFPLEdBQUcsVUFBQyxHQUFnQixFQUFFLEdBQWlCO0lBQ3pELElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzVCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDNUQsT0FBTztLQUNSO0lBRUQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FB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