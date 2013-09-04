YUI.add('pathogen-encoder-tests', function (Y) {
    var suite   = new Y.Test.Suite('Pathogen Encoder Tests'),
        Assert  = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Test URL Formatting',

        'test: single': function () {
            var loader = new Y.Loader(),
                resolved = loader.resolve();

            Assert.isNotUndefined(resolved);
        }
    }));

    Y.Test.Runner.add(suite);
});
