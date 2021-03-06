var assert = require("assert")
  , should = require("should")
  ;


var Args = require("../Args.js");

describe('Args', function(){

	describe("Basic optional args", function() {
		var testStringArg = "testArg";
		var testIntArg = 62;
		var testFloatArg = 47.9;
		var Photo = function(){};
		var testPhotoArg = new Photo;
		var testObjArg = {a:1, b:"hi"};
		var testDate = new Date();
		var testBool = true;

		it('should parse out a string', function(){
			var args = Args([{test:Args.STRING | Args.Optional}], [testStringArg]);
			assert.equal(args.test, testStringArg);
		});
		it('should parse out an int', function(){
			var args = Args([{test:Args.INT | Args.Optional}], [testIntArg]);
			assert.equal(args.test, testIntArg);
		});
		it('should parse out a float', function(){
			var args = Args([{test:Args.FLOAT | Args.Optional}], [testFloatArg]);
			assert.equal(args.test, testFloatArg);
		});
		it('should parse out an object', function(){
			var args = Args([
				{test1:Args.OBJECT | Args.Optional}
			], [testObjArg]);
			assert.equal(args.test1, testObjArg);
		});
		it('should parse out a specified type', function(){
			var args = Args([
				{test1:Args.OBJECT | Args.Optional, _type:Photo}
			], [testPhotoArg]);
			assert.equal(args.test1, testPhotoArg);
		});
		it("should parse out a Date", function() {
			var args = Args([
				{test1: Args.DATE | Args.Optional}
			], [testDate]);
			assert.equal(args.test1, testDate);
		});
		it("should parse out a bool", function() {
			var args = Args([
				{test1: Args.BOOL | Args.Optional}
			], [testBool]);
			assert.equal(args.test1, testBool);
		});
	});

	describe("Not null and optional args", function() {
		var testStringArg = "testArg";
		var testIntArg = 62;
		var testFloatArg = 47.9;
		var testDate = new Date();
		var testBool = true;

		it('should parse out a notnull int and an optional string', function(){
			var args = Args([
				{test1:Args.INT | Args.NotNull},
				{test2:Args.STRING | Args.Optional}
			], [testIntArg, testStringArg]);

			assert.equal(args.test1, testIntArg);
			assert.equal(args.test2, testStringArg);
		});
		it('should parse out a notnull int and not complain about a missing optional string', function(){
			var args = Args([
				{test1:Args.INT | Args.NotNull},
				{test2:Args.STRING | Args.Optional}
			], [testIntArg]);

			assert.equal(args.test1, testIntArg);
		});
		it('should parse out a notnull string and not complain about a missing optional int (optional arg first)', function(){
			var args = Args([
				{test1:Args.INT | Args.Optional},
				{test2:Args.STRING | Args.NotNull}
			], [testStringArg]);

			assert.equal(args.test2, testStringArg);
		});
		it("should parse out a notnull date and an optional bool and skip over an optional missing string", function() {
			var args = Args([
				{test1: Args.NotNull | Args.DATE},
				{test2: Args.Optional | Args.STRING},
				{test3: Args.Optional | Args.BOOL, _default: false}
			], [testDate, testBool]);
			assert.equal(args.test1, testDate);
			assert.equal(args.test2, undefined);
			assert.equal(args.test3, testBool);
		});
	});

	describe("Multiple types for one argument", function() {
		var testStringArg = "testArg";
		var testIntArg = 62;
		var testFloatArg = 47.9;

		it("should parse out an int with a choice of types", function() {
			var args = Args([
				{test1: Args.NotNull | Args.STRING | Args.INT | Args.FLOAT}
			], [testIntArg]);
			assert.equal(args.test1, testIntArg);
		});
		it("should parse out a float with a choice of types", function() {
			var args = Args([
				{test1: Args.NotNull | Args.STRING | Args.INT | Args.FLOAT}
			], [testFloatArg]);
			assert.equal(args.test1, testFloatArg);
		});
		it("should parse out a string with a choice of types", function() {
			var args = Args([
				{test1: Args.NotNull | Args.STRING | Args.INT | Args.FLOAT}
			], [testStringArg]);
			assert.equal(args.test1, testStringArg);
		});
	});

	describe("Basic named args", function() {
		var testStringArg = "testArg";
		var testIntArg = 62;
		var testIntArg2 = 82;
		var testFloatArg = 47.9;

		it("should parse a named string", function() {
			var args = Args([
				{test:Args.STRING | Args.Optional}
			], [{test: testStringArg}]);

			assert.equal(args.test, testStringArg);
		});

		it("should parse an int and a named string", function() {
			var args = Args([
				{test1:Args.INT | Args.Optional},
				{test2:Args.STRING | Args.Optional}
			], [testIntArg, {test2: testStringArg}]);

			assert.equal(args.test1, testIntArg);
			assert.equal(args.test2, testStringArg);
		});

		it("should parse an int and a named string and int", function() {
			var args = Args([
				{test1:Args.INT | Args.Optional},
				{test2:Args.INT | Args.Optional},
				{test3:Args.STRING | Args.Optional}
			], [testIntArg, {test3: testStringArg, test2: testIntArg2}]);

			assert.equal(args.test1, testIntArg);
			assert.equal(args.test2, testIntArg2);
			assert.equal(args.test3, testStringArg);
		});
	});

	describe("Default values", function() {
		var testStringArg = "testArg";
		var testIntArg = 62;
		var testIntArg2 = 63;
		var testFloatArg = 47.9;
		var testObjectArg = {hi: "ho", pi:3.14, di:2};
		var Photo = function(){return "photo";};
		var testPhotoArg = new Photo;
		var Foto = function(){return "foto";};
		var testFotoArg = new Foto;

		it("should set an int to a given default if null", function() {
			var args = Args([
				 {test1:Args.INT | Args.Optional, _default:testIntArg}
			], [null]);

			assert.equal(args.test1, testIntArg);
		});

		it("should set an int to a given default if missing", function() {
			var args = Args([
				 {test1:Args.INT | Args.Optional, _default:testIntArg}
			], []);

			assert.equal(args.test1, testIntArg);
		});

		it("should not set an int to a given default if arg is present and not null", function() {
			var args = Args([
				 {test1:Args.INT | Args.Optional, _default:testIntArg}
			], [testIntArg2]);

			assert.equal(args.test1, testIntArg2);
		});

		it("should set a specified type to a gvien default if null", function() {
			var args = Args([
				 {test1:Args.OBJECT | Args.Optional, _default:testPhotoArg, _type:Photo}
			], [null]);

			assert.equal(args.test1, testPhotoArg);
		});

		it("should set a specified type to a gvien default if wrong type is passed", function() {
			var args = Args([
				 {test1:Args.OBJECT | Args.Optional, _default:testPhotoArg, _type:Photo}
			], [testFotoArg]);

			assert.equal(args.test1, testPhotoArg);
		});
	});

	describe("Complex ordered args", function() {
		var testStringArg = "testArg";
		var testStringArg2 = "testArg2";
		var testStringArg3 = "testArg3";
		var defaultStringValue = "defaultValue";
		var emptyTestString = "";
		var testIntArg = 62;
		var testIntArg2 = 82;
		var testFloatArg = 47.9;
		var testObjectArg = {hi: "ho", pi:3.14, di:2};
		var Photo = function(){return "photo";};
		var testPhotoArg = new Photo;
		var testFunctionArg1 = function(){return "spit";};
		var testFunctionArg2 = function(){throw "melons";};
		var testFunctionArg3 = function(){return "the baby";};
		var testArrayBufferArg = new ArrayBuffer(8);

		it("should parse notnull object, notnull photo, optional string, notnull function, optional function", function() {
			var testArgs = [testObjectArg, testPhotoArg, testStringArg, testFunctionArg1, testFunctionArg2];
			var args = Args([
				{test1: Args.OBJECT | Args.NotNull},
				{test2: Args.OBJECT | Args.NotNull, _type:Photo},
				{test3: Args.STRING | Args.Optional},
				{test4: Args.FUNCTION | Args.NotNull},
				{test5: Args.FUNCTION | Args.Optional}
			], testArgs);

			assert.equal(args.test1, testObjectArg);
			assert.equal(args.test2, testPhotoArg);
			assert.equal(args.test3, testStringArg);
			assert.equal(args.test4, testFunctionArg1);
			assert.equal(args.test5, testFunctionArg2);
		});

		it("should parse notnull array buffer, optional string, null optional string, null optional string with default value, optional function and null optionl function", function() {
			var testArgs = [testArrayBufferArg, testStringArg, testFunctionArg1];
			var args = Args([
				{test1: Args.NotNull | Args.ARRAY_BUFFER},
				{test2: Args.Optional | Args.STRING},
				{test3: Args.Optional | Args.STRING},
				{test4: Args.Optional | Args.STRING, _default:defaultStringValue},
				{test5: Args.Optional | Args.FUNCTION},
				{test6: Args.Optional | Args.FUNCTION}
			], testArgs);

			assert.equal(args.test1, testArrayBufferArg);
			assert.equal(args.test2, testStringArg);
			assert.equal(args.test3, undefined);
			assert.equal(args.test4, defaultStringValue);
			assert.equal(args.test5, testFunctionArg1);
			assert.equal(args.test6, undefined);

		});

		it("should parse arraybuffer, string, empty optional string, optional string, undefined optional string with default, optional function, optional function, optional function", function() {
			var testArgs = [testArrayBufferArg, testStringArg, emptyTestString, testStringArg2, undefined, testFunctionArg1, testFunctionArg2, testFunctionArg3];
			var args = Args([
				{test1: Args.NotNull | Args.ARRAY_BUFFER},
				{test2: Args.NotNull | Args.STRING},
				{test3: Args.Optional | Args.STRING},
				{test4: Args.Optional | Args.STRING},
				{test5: Args.Optional | Args.STRING, _default: defaultStringValue},
				{test6: Args.Optional | Args.FUNCTION},
				{test7: Args.Optional | Args.FUNCTION},
				{test8: Args.Optional | Args.FUNCTION}
			], testArgs);

			assert.equal(args.test1, testArrayBufferArg);
			assert.equal(args.test2, testStringArg);
			assert.equal(args.test3, emptyTestString);
			assert.equal(args.test4, testStringArg2);
			assert.equal(args.test5, defaultStringValue);
			assert.equal(args.test6, testFunctionArg1);
			assert.equal(args.test7, testFunctionArg2);
			assert.equal(args.test8, testFunctionArg3);
		});

		it("should parse string, string, optional absent function, optional bool and optional bool as object", function() {
			var testArgs = [testStringArg, testStringArg2, false, {test5: true}];
			var args = Args([
				{test1: Args.STRING | Args.NotNull},
				{test2: Args.STRING | Args.NotNull},
				{test3: Args.FUNCTION | Args.Optional},
				{test4: Args.BOOL | Args.Optional, _default: true},
				{test5: Args.BOOL | Args.Optional, _default: false}
			], testArgs);

			assert.equal(args.test1, testStringArg);
			assert.equal(args.test2, testStringArg2);
			assert.equal(args.test3, undefined);
			assert.equal(args.test4, false);
			assert.equal(args.test5, true);
		});
		
	});

	describe("Errors", function() {
		var testNullArg = undefined;
		var testStringArg = "hi";
		var testIntArg = 2;
		var testFloatArg = 2.3;
		var Photo = function(){return "photo";};
		var testPhotoArg = new Photo;
		var Foto = function(){return "foto";};
		var testFotoArg = new Foto;

		it("should throw an error when a notnull arg is null", function() {
			(function() {
				Args([
					{test1: Args.STRING | Args.NotNull}
				], [testNullArg]);
			}).should.throw(/is null or undefined/);
		});

		it("should throw an error when a float is passed instead of an int", function() {
			(function() {
				Args([
					{test1: Args.INT | Args.NotNull}
				], [testFloatArg]);
			}).should.throw(/should be type/);
		});

		it("should throw an error when an object of the wrong type is found", function() {
			(function() {
				Args([
					{test1: Args.OBJECT | Args.NotNull, _type:Photo}
				], [testFotoArg]);
			}).should.throw(/should be type/);
		});

		it("should throw an error when no type is specified", function() {
			(function() {
				Args([
					 {test1: Args.NotNull}
				], [testStringArg]);
			}).should.throw(/no valid type specified/);
		});

		it("should throw an error when a group is specified and the arg is null", function() {
			(function() {
				Args([
					[
						{test1: Args.STRING},
						{test2: Args.INT}
					]
				], [testNullArg]);
			}).should.throw(/is null or undefined/);
		});

		it("should throw an error when a group is specified and no arguments match", function() {
			(function() {
				Args([
					[
						{test1: Args.STRING},
						{test2: Args.INT}
					]
				], [testFloatArg]);
			}).should.throw(/should be one of/);
		});
	});

	describe("Alternate argument groups", function() {
		var testStringArg = "testArg";
		var testStringArg2 = "testArg2";
		var testIntArg = 62;
		var testIntArg2 = 82;
		var testFloatArg = 47.9;
		var testFunctionArg = function(){return "spit";};

		it("should accept either of 2 options", function() {
			var testArgs1 = [testStringArg];
			var testArgs2 = [testIntArg];
			var testDefn = [
				[
					 {test1: Args.STRING},
					 {test2: Args.INT}
				]
			];
			var args1 = Args(testDefn, testArgs1);
			var args2 = Args(testDefn, testArgs2);
			
			assert.equal(args1.test1, testStringArg);
			assert.equal(args1.test2, undefined);

			assert.equal(args2.test1, undefined);
			assert.equal(args2.test2, testIntArg);
		});

		it("should accept either of 5 options", function() {
			var testArgs1 = [testStringArg];
			var testArgs2 = [testFloatArg];
			var testArgs3 = [testFunctionArg];
			var testDefn = [
				[
					 {test1: Args.STRING},
					 {test2: Args.INT},
					 {test3: Args.ARRAY},
					 {test4: Args.FUNCTION},
					 {test5: Args.FLOAT}
				]
			];

			var args1 = Args(testDefn, testArgs1);
			var args2 = Args(testDefn, testArgs2);
			var args3 = Args(testDefn, testArgs3);
			
			assert.equal(args1.test1, testStringArg);
			assert.equal(args1.test2, undefined);
			assert.equal(args1.test3, undefined);
			assert.equal(args1.test4, undefined);
			assert.equal(args1.test5, undefined);

			assert.equal(args2.test1, undefined);
			assert.equal(args2.test2, undefined);
			assert.equal(args2.test3, undefined);
			assert.equal(args2.test4, undefined);
			assert.equal(args2.test5, testFloatArg);

			assert.equal(args3.test1, undefined);
			assert.equal(args3.test2, undefined);
			assert.equal(args3.test3, undefined);
			assert.equal(args3.test4, testFunctionArg);
			assert.equal(args3.test5, undefined);
		});

		it("should accept either of 2 options along with some non grouped args", function() {
			var testArgs1 = [testStringArg, testIntArg2, testFunctionArg];
			var testArgs2 = [testIntArg, testIntArg2, testFunctionArg];
			var testDefn = [
				[
					 {test1: Args.STRING},
					 {test2: Args.INT}
				],
				{test3: Args.INT | Args.NotNull},
				{test4: Args.FUNCTION | Args.Optional},
				{test5: Args.STRING | Args.Optional}
			];
			var args1 = Args(testDefn, testArgs1);
			var args2 = Args(testDefn, testArgs2);
			
			assert.equal(args1.test1, testStringArg);
			assert.equal(args1.test2, undefined);
			assert.equal(args1.test3, testIntArg2);
			assert.equal(args1.test4, testFunctionArg);
			assert.equal(args1.test5, undefined);

			assert.equal(args2.test1, undefined);
			assert.equal(args2.test2, testIntArg);
			assert.equal(args2.test3, testIntArg2);
			assert.equal(args2.test4, testFunctionArg);
			assert.equal(args2.test5, undefined);
		});

		it("should accept either of 2 options along with some non grouped args which come first", function() {
			var testArgs1 = [testIntArg, testFunctionArg, testStringArg];
			var testArgs2 = [testIntArg, testFunctionArg, testIntArg2];
			var testDefn = [
				{test1: Args.INT | Args.NotNull},
				{test2: Args.FUNCTION | Args.Optional},
				[
					 {test3: Args.STRING},
					 {test4: Args.INT}
				],
				{test5: Args.STRING | Args.Optional}
			];
			var args1 = Args(testDefn, testArgs1);
			var args2 = Args(testDefn, testArgs2);
			
			assert.equal(args1.test1, testIntArg);
			assert.equal(args1.test2, testFunctionArg);
			assert.equal(args1.test3, testStringArg);
			assert.equal(args1.test4, undefined);
			assert.equal(args1.test5, undefined);

			assert.equal(args2.test1, testIntArg);
			assert.equal(args2.test2, testFunctionArg);
			assert.equal(args2.test3, undefined);
			assert.equal(args2.test4, testIntArg2);
			assert.equal(args2.test5, undefined);
		});

		it("should accept 2 argument groups", function() {
			var testArgs1 = [testStringArg, testStringArg2];
			var testArgs2 = [testIntArg, testStringArg2];
			var testDefn = [
				[
					 {test1: Args.STRING},
					 {test2: Args.INT}
				],
				[
					 {test3: Args.STRING},
					 {test4: Args.INT}
				]
			];
			var args1 = Args(testDefn, testArgs1);
			var args2 = Args(testDefn, testArgs2);
			
			assert.equal(args1.test1, testStringArg);
			assert.equal(args1.test2, undefined);
			assert.equal(args1.test3, testStringArg2);
			assert.equal(args1.test4, undefined);

			assert.equal(args2.test1, undefined);
			assert.equal(args2.test2, testIntArg);
			assert.equal(args2.test3, testStringArg2);
			assert.equal(args2.test4, undefined);
		});

	});
});
