YUI.add('pathogen-encoder-tests', function (Y) {
    var suite   = new Y.Test.Suite('Pathogen Encoder Tests'),
        Assert  = Y.Assert,

        NAMESPACE       = 'p/',
        GROUP_DELIM     = ';',
        SUB_GROUP_DELIM = '+',
        MODULE_DELIM    = ',',

        TYPES = ['js', 'css'],

        customComboBase;

    suite.add(new Y.Test.Case({
        name: 'Test Basic URL Formatting',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/';
            customComboBase = Y.config.customComboBase + NAMESPACE;
        },

        'test basic formatting for core only': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,
                    require: ['datatable']
                }),
                resolved = loader.resolve(true),

                type,
                urls,
                groups,
                subgroups,
                modules,
                len,
                i;

            for (i = 0, len = TYPES.length; i < len; i += 1) {
                type = TYPES[i];
                urls = resolved[type];
                Assert.areEqual(1, urls.length, 'There should only be one ' + type + ' combo url');

                path   = urls[0].split(customComboBase).pop();
                groups = path.split(GROUP_DELIM);
                Assert.areEqual(1, groups.length, 'There should only be one group of ' + type + ' modules');

                subgroups = groups[0].split(SUB_GROUP_DELIM);
                Assert.areEqual(3, subgroups.length, 'There should only be three subgroups');
                Assert.areEqual('core', subgroups[0], 'Unexpected core identifier');
                Assert.isTrue(/^\d+\.\d+\.\d+/.test(subgroups[1]), 'Unexpected core version');

                modules = subgroups.pop().split(MODULE_DELIM);
                Assert.isTrue(modules.length > 0, 'Missing modules in the ' + type + ' combo url');
            }
        },

        'test basic formatting for gallery only': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,
                    require: ['gallery-pathogen-encoder', 'gallery-bitly'],
                    modules: {
                        'gallery-pathogen-encoder': {
                            group: 'gallery'
                        },
                        'gallery-bitly': {
                            group: 'gallery'
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'There should only be one combo url');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(1, groups.length, 'There should only be one group of gallery modules');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'There should only be three subgroups');
            Assert.areEqual('gallery', subgroups[0], 'Unexpected gallery identifier');
            Assert.areEqual('2013.08.07-20-34', subgroups[1], 'Unexpected gallery version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length === 2, 'Missing modules in the gallery-only combo url');
        },

        'test basic formatting for application modules only': function () {
            var loader = new Y.Loader({
                    combine: true,
                    require: ['af-poll', 'af-dom', 'af-pageviz'],

                    groups: {
                        'ape-af': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: 'os/mit/td/ape-af-0.0.38/',
                            combine: true
                        }
                    },

                    modules: {
                        'af-poll': {
                            group: 'ape-af',
                            requires: [
                                'af-pageviz'
                            ]
                        },
                        'af-dom': {
                            group: 'ape-af',
                            requires: [
                                'node-base',
                                'node-core'
                            ]
                        },
                        'af-pageviz': {
                            group: 'ape-af',
                            requires: [
                                'event-custom-base',
                                'event-custom-complex'
                            ]
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'There should only be one combo url');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(1, groups.length, 'There should only be one group of application modules');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(2, subgroups.length, 'There should only be three subgroups');
            Assert.areEqual(loader.groups['ape-af'].root.slice(0, -1), subgroups[0], 'Unexpected version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length === 3, 'Missing modules in the application-only combo url');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test Complex URL Formatting',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/';
            customComboBase = Y.config.customComboBase + NAMESPACE;
        },

        'test formatting for core + gallery + application': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,

                    require: [
                        'datatable',
                        'gallery-pathogen-encoder',
                        'gallery-bitly',
                        'af-poll',
                        'af-dom',
                        'af-pageviz'
                    ],

                    groups: {
                        'ape-af': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: 'os/mit/td/ape-af-0.0.38/',
                            combine: true
                        }
                    },

                    modules: {
                        'gallery-pathogen-encoder': {
                            group: 'gallery'
                        },
                        'gallery-bitly': {
                            group: 'gallery'
                        },
                        'af-poll': {
                            group: 'ape-af',
                            requires: [
                                'af-pageviz'
                            ]
                        },
                        'af-dom': {
                            group: 'ape-af',
                            requires: [
                                'node-base',
                                'node-core'
                            ]
                        },
                        'af-pageviz': {
                            group: 'ape-af',
                            requires: [
                                'event-custom-base',
                                'event-custom-complex'
                            ]
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'There should only be one js combo url');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(3, groups.length, 'There should be three groups of js modules');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'There should only be three core subgroups');
            Assert.areEqual('core', subgroups[0], 'Unexpected core identifier');
            Assert.isTrue(/^\d+\.\d+\.\d+/.test(subgroups[1]), 'Unexpected core version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Missing core modules in the js combo url');

            subgroups = groups[1].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'There should only be three gallery subgroups');
            Assert.areEqual('gallery', subgroups[0], 'Unexpected gallery identifier');
            Assert.areEqual('2013.08.07-20-34', subgroups[1], 'Unexpected gallery version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Missing gallery modules in the js combo url');

            subgroups = groups[2].split(SUB_GROUP_DELIM);
            Assert.areEqual(2, subgroups.length, 'There should only be two app subgroups');
            Assert.areEqual(loader.groups['ape-af'].root.slice(0, -1), subgroups[0], 'Unexpected app version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Missing app modules in the js combo url');
        }
    }));

    Y.Test.Runner.add(suite);
});
