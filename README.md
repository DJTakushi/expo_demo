# expo_demo

# run
```
npm run android
npm run ios # you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac
npm run web
```


# notes
built with
```
npx create-expo-app@latest
```

Suggestion by boilerplate:
```
Step 3: Get a fresh start
When you're ready, run npm run reset-project to get a fresh app directory. This will move the current app to app-example.
```

Warnings about deprecated dependencies seems normal : https://www.reddit.com/r/expo/comments/1egsevn/dependency_issues_while_creating_a_new_app/

# TODO
- [ ] image upload
  - [ ] avatar with multiple formats
- [ ] supabase api content moved to dedicated files
- [ ] account management
  - [ ] display account-name in tabs
  - [x] finish tutorial (https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
  - [x] permissions for create, update, delete
  - [ ] Google login
- [ ] enter edits/deletes entry
- [ ] clicking on text-box overrides text
- [ ] component consolidation
  - [ ] supabase connection base class
  - [ ] data-table
- [ ] hide table edit buttons if missing login