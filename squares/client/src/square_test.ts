import * as assert from 'assert';
import { solid, split, toJson, fromJson, find_square, replace, Square } from './square';
import { cons, nil } from './list';


describe('square', function() {

  it('toJson', function() {
    assert.deepEqual(toJson(solid("white")), "white");
    assert.deepEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepEqual(fromJson("white"), solid("white"));
    assert.deepEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

  it('find_square', function() {
    const square0: Square = {kind: "solid", color: "white"}; 
    const square1: Square = {kind: "split", nw: {kind: "solid", color: "white"}, 
    ne: {kind: "solid", color: "red"},
    sw: {kind: "solid", color: "orange"}, 
    se: {kind: "solid", color: "yellow"}};
    const square2: Square = {kind: "split", nw: {kind: "solid", color: "white"}, 
    ne: {kind: "solid", color: "red"},
    sw: {kind: "solid", color: "orange"}, 
    se: {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}};
    const square3: Square = {kind: "split", nw: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0}, 
      ne: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0},
      sw: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0}, 
      se: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0}};
    // error case 
    assert.throws(() => find_square(cons("NE", nil), square0), Error)
    assert.throws(() => find_square(cons("NE", cons("NE", nil)), square1), Error)
    //base case
    assert.deepEqual(find_square(nil, square1), square1);
    assert.deepEqual(find_square(nil, square3), square3);
    //one recursion
    //first branch
    assert.deepEqual(find_square(cons("NE", nil), square1), {kind: "solid", color: "red"});
    assert.deepEqual(find_square(cons("NE", nil), square2), {kind: "solid", color: "red"});
    //second branch
    assert.deepEqual(find_square(cons("NW", nil), square1), {kind: "solid", color: "white"});
    assert.deepEqual(find_square(cons("NW", nil), square2), {kind: "solid", color: "white"});
    //third branch
    assert.deepEqual(find_square(cons("SE", nil), square1), {kind: "solid", color: "yellow"});
    assert.deepEqual(find_square(cons("SE", nil), square2), {kind: "split", nw: square1, 
    ne: square1, sw: square1, se: square0});
    //last branch
    assert.deepEqual(find_square(cons("SW", nil), square1), {kind: "solid", color: "orange"});
    assert.deepEqual(find_square(cons("SW", nil), square2), {kind: "solid", color: "orange"});
    //many recusion
    //1
    assert.deepEqual(find_square(cons("SE", cons("NE", nil)), square2), square1);
    assert.deepEqual(find_square(cons("SE", cons("SE", nil)), square2), square0);
    //2
    assert.deepEqual(find_square(cons("SW", cons("NE", nil)), square3), square1);
    assert.deepEqual(find_square(cons("SW", cons("SE", nil)), square3), square0);
    //3
    assert.deepEqual(find_square(cons("NE", cons("NE", nil)), square3), square1);
    assert.deepEqual(find_square(cons("NE", cons("SE", nil)), square3), square0);
    //4
    assert.deepEqual(find_square(cons("NW", cons("NE", nil)), square3), square1);
    assert.deepEqual(find_square(cons("NW", cons("SE", nil)), square3), square0);
  });
  it('replace', function() {
    const square0: Square = {kind: "solid", color: "white"}; 
    const square1: Square = {kind: "split", nw: {kind: "solid", color: "white"}, 
    ne: {kind: "solid", color: "red"},
    sw: {kind: "solid", color: "orange"}, 
    se: {kind: "solid", color: "yellow"}};
    const square2: Square = {kind: "split", nw: {kind: "solid", color: "white"}, 
    ne: {kind: "solid", color: "red"},
    sw: {kind: "solid", color: "orange"}, 
    se: {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}};
    const square3: Square = {kind: "split", nw: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0}, 
      ne: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0},
      sw: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0}, 
      se: {kind: "split", nw: square1, 
        ne: square1, sw: square1, se: square0}};
    // error case 
    assert.throws(() => replace(cons("NE", nil), square0, square0), Error)
    assert.throws(() => replace(cons("NE", cons("NE", nil)), square1, square0), Error)
    //base case
    assert.deepEqual(replace(nil, square0, square1), square1);
    assert.deepEqual(replace(nil, square2, square3), square3);
    //one recursion
    assert.deepEqual(replace(cons("NW", nil), square1, square0), split({kind: "solid", color: "white"}, 
      {kind: "solid", color: "red"}, {kind: "solid", color: "orange"}, {kind: "solid", color: "yellow"}));
    assert.deepEqual(replace(cons("NW", nil), square1, square1), split(square1, 
      {kind: "solid", color: "red"}, {kind: "solid", color: "orange"}, {kind: "solid", color: "yellow"}));

    assert.deepEqual(replace(cons("NE", nil), square1, square0), split({kind: "solid", color: "white"}, 
      square0, {kind: "solid", color: "orange"}, {kind: "solid", color: "yellow"}));
    assert.deepEqual(replace(cons("NE", nil), square1, square1), split({kind: "solid", color: "white"},
      square1, {kind: "solid", color: "orange"}, {kind: "solid", color: "yellow"}));
    
    assert.deepEqual(replace(cons("SW", nil), square1, square0), split({kind: "solid", color: "white"}, 
      {kind: "solid", color: "red"}, square0, {kind: "solid", color: "yellow"}));
    assert.deepEqual(replace(cons("SW", nil), square1, square1), split({kind: "solid", color: "white"}, 
      {kind: "solid", color: "red"}, square1, {kind: "solid", color: "yellow"}));

    assert.deepEqual(replace(cons("SE", nil), square1, square0), split({kind: "solid", color: "white"}, 
      {kind: "solid", color: "red"}, {kind: "solid", color: "orange"}, square0));
    assert.deepEqual(replace(cons("SE", nil), square1, square1), split({kind: "solid", color: "white"}, 
      {kind: "solid", color: "red"}, {kind: "solid", color: "orange"}, square1));
    
    //many recursion
    assert.deepEqual(replace(cons("NW", cons("NE", nil)), square3, square0), split({kind: "split", nw: square1, 
    ne: square0, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}));
    assert.deepEqual(replace(cons("NW", cons("NE", nil)), square3, square1), split({kind: "split", nw: square1, 
    ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}));

    assert.deepEqual(replace(cons("NE", cons("NE", nil)), square3, square0), split({kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square0, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}));
    assert.deepEqual(replace(cons("NE", cons("NE", nil)), square3, square1), split({kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}));

    assert.deepEqual(replace(cons("SW", cons("NE", nil)), square3, square0), split({kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square0, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}));
    assert.deepEqual(replace(cons("SW", cons("NE", nil)), square3, square1), split({kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}));

    assert.deepEqual(replace(cons("SE", cons("NE", nil)), square3, square0), split({kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square0, sw: square1, se: square0}));
    assert.deepEqual(replace(cons("SE", cons("NE", nil)), square3, square1), split({kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}, {kind: "split", nw: square1, 
      ne: square1, sw: square1, se: square0}));
  });
});
