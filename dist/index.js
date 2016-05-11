'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var getMilestoneByTitle = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var title = _ref.title;
    var user = _ref.user;
    var repo = _ref.repo;
    var _ref$state = _ref.state;
    var state = _ref$state === undefined ? 'closed' : _ref$state;
    var milestones, milestone;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (title) {
              _context.next = 2;
              break;
            }

            throw new Error('You did not specify a milestone');

          case 2:
            _context.next = 4;
            return getAllMilestones({
              user: user, repo: repo, state: state,
              page: 0,
              per_page: 100
            });

          case 4:
            milestones = _context.sent;
            milestone = milestones.find(function (milestone) {
              return milestone.title === title;
            });

            if (milestone) {
              _context.next = 8;
              break;
            }

            throw new Error('Could not find the given milestone: ' + title);

          case 8:
            return _context.abrupt('return', milestone);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getMilestoneByTitle(_x) {
    return ref.apply(this, arguments);
  };
}();

var getIssues = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var user = _ref2.user;
    var repo = _ref2.repo;
    var milestoneData = _ref2.milestoneData;
    var issues, bugs, features, improvements;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // allow passing the milestone object from github api response:
            if ((typeof milestoneData === 'undefined' ? 'undefined' : _typeof(milestoneData)) === 'object') {
              milestoneData = milestoneData.number;
            }

            _context2.next = 3;
            return getRepoIssues({
              user: user, repo: repo, milestoneData: milestoneData,
              state: 'closed',
              per_page: 100
            });

          case 3:
            issues = _context2.sent;
            bugs = issues.filter(function (issue) {
              var isBug = issue.labels.find(function (label) {
                return label.name === 'type:bug';
              });
              if (isBug) return issue;
            });
            features = issues.filter(function (issue) {
              var isFeature = issue.labels.find(function (label) {
                return label.name === 'type:feature';
              });
              if (isFeature) return issue;
            });
            improvements = issues.filter(function (issue) {
              var isImprovement = issue.labels.find(function (label) {
                return label.name === 'type:improvement';
              });
              if (isImprovement) return issue;
            });
            return _context2.abrupt('return', { bugs: bugs, features: features, improvements: improvements });

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getIssues(_x3) {
    return ref.apply(this, arguments);
  };
}();

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _resolveGitRemote = require('resolve-git-remote');

var _resolveGitRemote2 = _interopRequireDefault(_resolveGitRemote);

var _hogan = require('hogan.js');

var _hogan2 = _interopRequireDefault(_hogan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var expressions = ['Whew!', 'Ain\'t that fancy!', 'Woah!', 'Whoo!', 'Awesome!', 'Dude!', 'Holy Cow!', 'Get out of town!', 'No Way!', 'Nice!', 'Sweet!', 'OMG!'];
var remote = _bluebird2.default.promisify(_resolveGitRemote2.default);

var github = new _github2.default({ version: '3.0.0' });
var getAllMilestones = _bluebird2.default.promisify(github.issues.getAllMilestones);
var getRepoIssues = _bluebird2.default.promisify(github.issues.repoIssues);

exports.default = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref3) {
    var user = _ref3.user;
    var repo = _ref3.repo;
    var milestone = _ref3.milestone;
    var template = _ref3.template;
    var token = _ref3.token;
    var milestoneData, issues, tmpl, md;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (token) {
              github.authenticate({
                type: 'oauth',
                token: token
              });
            }

            _context3.next = 3;
            return getMilestoneByTitle({ user: user, repo: repo, title: milestone });

          case 3:
            milestoneData = _context3.sent;
            _context3.next = 6;
            return getIssues({ user: user, repo: repo, milestoneData: milestoneData });

          case 6:
            issues = _context3.sent;

            // generate the markdown:
            issues.bugs.expression = expressions.splice(Math.floor(Math.random() * expressions.length), 1);
            issues.features.expression = expressions.splice(Math.floor(Math.random() * expressions.length), 1);
            issues.improvements.expression = expressions.splice(Math.floor(Math.random() * expressions.length), 1);
            tmpl = _hogan2.default.compile(template);
            md = tmpl.render({ milestone: milestoneData, issues: issues, repo: repo });
            return _context3.abrupt('return', md);

          case 13:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  function releaseNotes(_x5) {
    return ref.apply(this, arguments);
  }

  return releaseNotes;
}();

