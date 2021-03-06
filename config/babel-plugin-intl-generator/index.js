/* eslint-disable */
'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = _default

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/toConsumableArray'),
)

var _objectSpread2 = _interopRequireDefault(require('@babel/runtime/helpers/objectSpread'))

var _typeof2 = _interopRequireDefault(require('@babel/runtime/helpers/typeof'))

var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'))

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'))

var p = _interopRequireWildcard(require('path'))

var _fs = require('fs')

var _mkdirp = require('mkdirp')

var _printIcuMessage = _interopRequireDefault(require('./print-icu-message'))

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 *
 * Improve by Daniel Le (thanhlcm90@gmail.com) to support react-intl
 */
var COMPONENT_NAMES = ['FormattedMessage', 'FormattedHTMLMessage']
var FUNCTION_NAMES = ['defineMessages']
var DESCRIPTOR_PROPS = new Set(['id', 'description', 'defaultMessage'])
var EXTRACTED = Symbol('ReactIntlExtracted')
var MESSAGES = Symbol('ReactIntlMessages')
var PRE_MESSAGES = Symbol('PreReactIntlMessages')
var LAST_LANGUAGE = null
var WRITEFILE_TIMER = null
var PREPARE_FILE_LANGUAGE = {}

function _default(_ref) {
  var t = _ref.types

  function getModuleSourceName(opts) {
    return opts.moduleSourceName || 'react-intl'
  }

  function evaluatePath(path) {
    var evaluated = path.evaluate()

    if (evaluated.confident) {
      return evaluated.value
    }

    throw path.buildCodeFrameError(
      '[React Intl] Messages must be statically evaluate-able for extraction.',
    )
  }

  function getMessageDescriptorKey(path) {
    if (path.isIdentifier() || path.isJSXIdentifier()) {
      return path.node.name
    }

    return evaluatePath(path)
  }

  function getMessageDescriptorValue(path) {
    if (path.isJSXExpressionContainer()) {
      path = path.get('expression')
    } // Always trim the Message Descriptor values.

    var descriptorValue = evaluatePath(path)

    if (typeof descriptorValue === 'string') {
      return descriptorValue.trim()
    }

    return descriptorValue
  }

  function getICUMessageValue(messagePath) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$isJSXSource = _ref2.isJSXSource,
      isJSXSource = _ref2$isJSXSource === void 0 ? false : _ref2$isJSXSource

    var message = getMessageDescriptorValue(messagePath)

    try {
      return (0, _printIcuMessage.default)(message)
    } catch (parseError) {
      if (isJSXSource && messagePath.isLiteral() && message.indexOf('\\\\') >= 0) {
        throw messagePath.buildCodeFrameError(
          '[React Intl] Message failed to parse. ' +
            'It looks like `\\`s were used for escaping, ' +
            "this won't work with JSX string literals. " +
            'Wrap with `{}`. ' +
            'See: http://facebook.github.io/react/docs/jsx-gotchas.html',
        )
      }

      throw messagePath.buildCodeFrameError(
        '[React Intl] Message failed to parse. ' +
          'See: http://formatjs.io/guides/message-syntax/' +
          '\n'.concat(parseError),
      )
    }
  }

  function createMessageDescriptor(propPaths) {
    return propPaths.reduce(function(hash, _ref3) {
      var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
        keyPath = _ref4[0],
        valuePath = _ref4[1]

      var key = getMessageDescriptorKey(keyPath)

      if (DESCRIPTOR_PROPS.has(key)) {
        hash[key] = valuePath
      }

      return hash
    }, {})
  }

  function evaluateMessageDescriptor(_ref5) {
    var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref6$isJSXSource = _ref6.isJSXSource,
      isJSXSource = _ref6$isJSXSource === void 0 ? false : _ref6$isJSXSource

    var descriptor = (0, _extends2.default)({}, _ref5)
    Object.keys(descriptor).forEach(function(key) {
      var valuePath = descriptor[key]

      if (key === 'defaultMessage') {
        descriptor[key] = getICUMessageValue(valuePath, {
          isJSXSource: isJSXSource,
        })
      } else {
        descriptor[key] = getMessageDescriptorValue(valuePath)
      }
    })
    return descriptor
  }

  function storeMessage(_ref7, path, state) {
    var id = _ref7.id,
      description = _ref7.description,
      defaultMessage = _ref7.defaultMessage
    var file = state.file,
      opts = state.opts

    if (!(id && defaultMessage)) {
      throw path.buildCodeFrameError(
        '[React Intl] Message Descriptors require an `id` and `defaultMessage`.',
      )
    }

    var messages = file.get(MESSAGES)

    var loc

    if (opts.extractSourceLocation) {
      loc = (0, _objectSpread2.default)(
        {
          file: p.relative(process.cwd(), file.opts.filename),
        },
        path.node.loc,
      )
    }

    if (messages.has(id)) {
      var existing = messages.get(id)

      if (defaultMessage !== existing.defaultMessage) {
        throw path.buildCodeFrameError(
          '[React Intl] Duplicate message id: "'.concat(id, '", ') +
            'but the `description` and/or `defaultMessage` are different.',
        )
      }
    }

    if (opts.enforceDescriptions) {
      if (
        !description ||
        ((0, _typeof2.default)(description) === 'object' && Object.keys(description).length < 1)
      ) {
        throw path.buildCodeFrameError('[React Intl] Message must have a `description`.')
      }
    }

    // var loc

    // if (opts.extractSourceLocation) {
    //   loc = (0, _objectSpread2.default)(
    //     {
    //       file: p.relative(process.cwd(), file.opts.filename),
    //     },
    //     path.node.loc,
    //   )
    // }
    messages.set(
      id,
      (0, _objectSpread2.default)(
        {
          id: id,
          description: description,
          defaultMessage: defaultMessage,
        },
        loc,
      ),
    )

    // LANGUAGE_MESSAGES[id] = {
    //   id: id,
    //   defaultMessage: defaultMessage,
    //   from: loc,
    // }
  }

  function referencesImport(path, mod, importedNames) {
    if (!(path.isIdentifier() || path.isJSXIdentifier())) {
      return false
    }

    return importedNames.some(function(name) {
      return path.referencesImport(mod, name)
    })
  }

  function tagAsExtracted(path) {
    path.node[EXTRACTED] = true
  }

  function wasExtracted(path) {
    return !!path.node[EXTRACTED]
  }

  return {
    pre: function pre(file) {
      let { opts } = this
      const messages = new Map()
      const locFile = p.relative(process.cwd(), file.opts.filename)

      if (!LAST_LANGUAGE && opts.languageFile && _fs.existsSync(opts.languageFile)) {
        let oldContent
        let collection = {}

        try {
          oldContent = _fs.readFileSync(opts.languageFile)
        } catch (ex) {
          oldContent = null
        }

        if (oldContent) {
          try {
            LAST_LANGUAGE = JSON.parse(oldContent)
          } catch (ex) {
            throw file.path.buildCodeFrameError(ex.message)
          }
        }
        console.log('read language file again')
      }
      if (LAST_LANGUAGE) {
        Object.keys(LAST_LANGUAGE).forEach(function(id) {
          messages.set(
            id,
            (0, _objectSpread2.default)({
              id: id,
              defaultMessage: LAST_LANGUAGE[id],
            }),
          )
        })
      }

      file.set(MESSAGES, messages)
    },
    post: function post(file) {
      var opts = this.opts
      var messages = file.get(MESSAGES)
      var descriptors = (0, _toConsumableArray2.default)(messages.values())
      const lastLanguage = LAST_LANGUAGE || {}

      const key2 = Object.keys(lastLanguage)
      const isNew = descriptors.some(({ id }) => !key2.includes(id))
      const isRemove = key2.some(key => !descriptors.some(({ id }) => id === key))
      const isChange = descriptors.some(
        ({ id, defaultMessage }) => defaultMessage !== lastLanguage[id],
      )

      if (!LAST_LANGUAGE) LAST_LANGUAGE = {}
      descriptors.forEach(({ id, defaultMessage }) => {
        LAST_LANGUAGE[id] = defaultMessage
      })

      if (opts.languageFile && (isNew || isRemove || isChange)) {
        clearTimeout(WRITEFILE_TIMER)
        WRITEFILE_TIMER = setTimeout(function() {
          const sorted = {}
          Object.keys(LAST_LANGUAGE)
            .sort()
            .forEach(function(id) {
              sorted[id] = LAST_LANGUAGE[id]
            })
          var messagesFile = JSON.stringify(sorted, null, 2)
          ;(0, _fs.writeFileSync)(opts.languageFile, messagesFile)

          LAST_LANGUAGE = sorted
          console.log('Done! write file language')
        }, 2000)
      }
    },
    visitor: {
      JSXOpeningElement: function JSXOpeningElement(path, state) {
        if (wasExtracted(path)) {
          return
        }
        var file = state.file,
          opts = state.opts
        var moduleSourceName = getModuleSourceName(opts)
        var name = path.get('name')

        if (name.referencesImport(moduleSourceName, 'FormattedPlural')) {
          file.log.warn(
            '[React Intl] Line '.concat(path.node.loc.start.line, ': ') +
              'Default messages are not extracted from ' +
              '<FormattedPlural>, use <FormattedMessage> instead.',
          )
          return
        }

        if (referencesImport(name, moduleSourceName, COMPONENT_NAMES)) {
          var attributes = path.get('attributes').filter(function(attr) {
            return attr.isJSXAttribute()
          })
          var descriptor = createMessageDescriptor(
            attributes.map(function(attr) {
              return [attr.get('name'), attr.get('value')]
            }),
          ) // In order for a default message to be extracted when
          // declaring a JSX element, it must be done with standard
          // `key=value` attributes. But it's completely valid to
          // write `<FormattedMessage {...descriptor} />` or
          // `<FormattedMessage id={dynamicId} />`, because it will be
          // skipped here and extracted elsewhere. The descriptor will
          // be extracted only if a `defaultMessage` prop exists.

          if (descriptor.defaultMessage) {
            // Evaluate the Message Descriptor values in a JSX
            // context, then store it.
            descriptor = evaluateMessageDescriptor(descriptor, {
              isJSXSource: true,
            })
            storeMessage(descriptor, path, state) // Remove description since it's not used at runtime.

            attributes.some(function(attr) {
              var ketPath = attr.get('name')

              if (getMessageDescriptorKey(ketPath) === 'description') {
                attr.remove()
                return true
              }
            }) // Tag the AST node so we don't try to extract it twice.

            tagAsExtracted(path)
          }
        }
      },
      CallExpression: function CallExpression(path, state) {
        var moduleSourceName = getModuleSourceName(state.opts)
        var callee = path.get('callee')

        function assertObjectExpression(node) {
          if (!(node && node.isObjectExpression())) {
            throw path.buildCodeFrameError(
              '[React Intl] `'.concat(callee.node.name, '()` must be ') +
                'called with an object expression with values ' +
                'that are React Intl Message Descriptors, also ' +
                'defined as object expressions.',
            )
          }
        }

        function processMessageObject(messageObj) {
          assertObjectExpression(messageObj)

          if (wasExtracted(messageObj)) {
            return
          }

          var properties = messageObj.get('properties')
          var descriptor = createMessageDescriptor(
            properties.map(function(prop) {
              return [prop.get('key'), prop.get('value')]
            }),
          ) // Evaluate the Message Descriptor values, then store it.

          descriptor = evaluateMessageDescriptor(descriptor)
          storeMessage(descriptor, messageObj, state) // Remove description since it's not used at runtime.

          messageObj.replaceWith(
            t.objectExpression([
              t.objectProperty(t.stringLiteral('id'), t.stringLiteral(descriptor.id)),
              t.objectProperty(
                t.stringLiteral('defaultMessage'),
                t.stringLiteral(descriptor.defaultMessage),
              ),
            ]),
          ) // Tag the AST node so we don't try to extract it twice.

          tagAsExtracted(messageObj)
        }

        if (referencesImport(callee, moduleSourceName, FUNCTION_NAMES)) {
          var messagesObj = path.get('arguments')[0]
          assertObjectExpression(messagesObj)
          messagesObj
            .get('properties')
            .map(function(prop) {
              return prop.get('value')
            })
            .forEach(processMessageObject)
        }
        if (referencesImport(callee, moduleSourceName, ['formatMessage'])) {
          const messagesObj = path.get('arguments')[0]
          processMessageObject(messagesObj)
        }
      },
    },
  }
}
